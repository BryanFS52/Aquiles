"use client";

import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface ArrowProps {
    onClick?: () => void;
}

export const CustomNextArrow: React.FC<ArrowProps> = ({ onClick }) => (
    <div
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-primary/90 hover:bg-primary-light dark:bg-secondary/90 dark:hover:bg-darkBlue transition-all duration-300 text-white p-2 rounded-full cursor-pointer z-20 shadow-lg hover:scale-110"
        onClick={onClick}
    >
        <FaArrowRight className="text-sm" />
    </div>
);

export const CustomPrevArrow: React.FC<ArrowProps> = ({ onClick }) => (
    <div
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-primary/90 hover:bg-primary-light dark:bg-secondary/90 dark:hover:bg-darkBlue transition-all duration-300 text-white p-2 rounded-full cursor-pointer z-20 shadow-lg hover:scale-110"
        onClick={onClick}
    >
        <FaArrowLeft className="text-sm" />
    </div>
);