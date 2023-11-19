from absl import app, flags, logging
from absl.flags import FLAGS
import cv2
import os
import numpy as np
import tensorflow as tf

from modules.evaluations import get_val_data, perform_val
from modules.models import ArcFaceModel
from modules.utils import set_memory_growth, load_yaml, l2_norm

flags.DEFINE_string('cfg_path', './configs/arc_res50.yaml', 'config file path')
flags.DEFINE_string('gpu', '0', 'which gpu to use')
flags.DEFINE_string('img_folder', '/content/output_folder', 'path to folder containing input images')

def main(_argv):
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
    os.environ['CUDA_VISIBLE_DEVICES'] = FLAGS.gpu

    logger = tf.get_logger()
    logger.disabled = True
    logger.setLevel(logging.FATAL)
    set_memory_growth()

    cfg = load_yaml(FLAGS.cfg_path)

    model = ArcFaceModel(size=cfg['input_size'],
                         backbone_type=cfg['backbone_type'],
                         training=False)

    ckpt_path = tf.train.latest_checkpoint('./checkpoints/' + cfg['sub_name'])
    if ckpt_path is not None:
        print("[*] load ckpt from {}".format(ckpt_path))
        model.load_weights(ckpt_path)
    else:
        print("[*] Cannot find ckpt from {}.".format(ckpt_path))
        exit()

    img_folder = FLAGS.img_folder
    folder_name = os.path.basename(img_folder)
    output_folder = f'./output_embeds/{folder_name}'
    os.makedirs(output_folder, exist_ok=True)

    image_files = [f for f in os.listdir(img_folder) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp'))]

    embeddings = []

    for image_file in image_files:
        image_path = os.path.join(img_folder, image_file)
        print("[*] Encode {} to {}/output_embeds_{}.npy".format(image_path, output_folder, image_file))

        img = cv2.imread(image_path)
        img = cv2.resize(img, (cfg['input_size'], cfg['input_size']))
        img = img.astype(np.float32) / 255.
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        if len(img.shape) == 3:
            img = np.expand_dims(img, 0)
        embeds = l2_norm(model(img))
        embeddings.append(embeds.numpy())

        # Exclude file extension when constructing the output file name
        file_name_without_extension = os.path.splitext(image_file)[0]
        output_file = os.path.join(output_folder, f'output_embeds_{folder_name}_{file_name_without_extension}.npy')
        np.save(output_file, embeds.numpy())

    embeddings = np.array(embeddings)
    print("Embeddings shape:", embeddings.shape)

if __name__ == '__main__':
    try:
        app.run(main)
    except SystemExit:
        pass
