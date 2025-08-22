import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@components/UI/Card';
import { AssignmentCard } from './types';

interface AssignmentCardComponentProps {
    card: AssignmentCard;
    isDarkMode?: boolean;
}

export const AssignmentCardComponent: React.FC<AssignmentCardComponentProps> = ({
    card,
    isDarkMode = false
}) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(card.route);
    };

    const header = (
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}>
            {card.title}
        </h2>
    );

    const body = (
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
            {card.description}
        </p>
    );

    const footer = (
        <button
            onClick={handleClick}
            className={`px-6 py-3 rounded-lg w-full font-medium transition-all duration-200 ${isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
        >
            {card.buttonText}
        </button>
    );

    return (
        <Card
            header={header}
            body={body}
            footer={footer}
            isDarkMode={isDarkMode}
            className="w-full md:w-[400px] lg:w-[450px] flex flex-col justify-between"
        />
    );
};
