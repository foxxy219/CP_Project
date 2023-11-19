import cv2
import os
from cleanvision import Imagelab

# Set the path to the folder containing the videos
video_folder = 'C:/Users/quanb/OneDrive/Desktop/CP_Project/AI/data_set/AIO/'

# Loop through the video files
for video_file in os.listdir(video_folder):
    if video_file.endswith('.mp4') or video_file.endswith('.mov'):
        # Open the video file
        video = cv2.VideoCapture(os.path.join(video_folder, video_file))

        # Check if the video file was opened successfully
        if not video.isOpened():
            print("Error opening video file:", video_file)
            continue

        # Initialize variables
        frame_count = 0
        success = True
        frame_skip = 10

        # Loop through the video frames
        while success:
            # Read the next frame from the video
            success, image = video.read()

            # If the frame was read successfully
            if success:
                if frame_count % frame_skip == 0:
                    # Save the frame as an image file
                    frame_file = os.path.join(video_folder, 'frames', video_file[:-4], "frame%d.jpg" % frame_count)
                    os.makedirs(os.path.dirname(frame_file), exist_ok=True)
                    cv2.imwrite(frame_file, image)

                # Increment the frame count
                frame_count += 1

        # Release the video file
        video.release()

# # Specify path to folder containing the image files in your dataset
# imagelab = Imagelab(data_path="C:/Users/quanb/OneDrive/Desktop/CP_Project/AI/data_set/AIO/frames/NguyenGiaHung")

# # Automatically check for a predefined list of issues within your dataset
# imagelab.find_issues()

# # Produce a neat report of the issues found in your dataset
# imagelab.report()
