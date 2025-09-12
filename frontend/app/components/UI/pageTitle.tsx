import React from 'react';

interface PageTitleProps {
    children: React.ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = ({ children }) => {
    return (
        <div className="mb-8 -mx-2 sm:-mx-4 md:-mx-6 lg:-mx-6 xl:-mx-6 px-2 sm:px-4 md:px-6 lg:px-6 xl:px-6">
            <div className="flex items-center gap-4">
                <div className="w-1.5 h-14 bg-gradient-to-b from-primary via-lightGreen to-primary dark:from-shadowBlue dark:via-darkBlue dark:to-shadowBlue rounded-full shadow-md"></div>
                <h1 className="text-black dark:text-dark-text text-3xl lg:text-4xl font-inter font-semibold">
                    {children}
                </h1>
            </div>
        </div>
    );
};

export default PageTitle;