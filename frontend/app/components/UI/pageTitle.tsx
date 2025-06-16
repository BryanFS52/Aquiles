import React from 'react';

interface PageTitleProps {
    children: React.ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = ({ children }) => {
    return (
        <h1 className="text-black dark:text-white text-3xl lg:text-4xl pb-3 border-b-2 border-gray-300 dark:border-gray-600 w-full sm:w-3/4 lg:w-1/2 font-inter font-semibold transition-colors duration-300 mb-8">
            {children}
        </h1>
    );
};

export default PageTitle;