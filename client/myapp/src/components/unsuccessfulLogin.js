const react = require('react');


const unsuccessfulLogin = () => {
    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <script defer src="https://unpkg.com/alpinejs@3.2.3/dist/cdn.min.js"></script>
            <link
                rel="stylesheet"
                href="https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css"
            />
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Unsuccessful login
                        </h1>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default unsuccessfulLogin;
