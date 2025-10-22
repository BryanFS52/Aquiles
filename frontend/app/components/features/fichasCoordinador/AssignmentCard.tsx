import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@components/UI/Card';
import { AssignmentCard } from './types';

interface AssignmentCardComponentProps {
    card: AssignmentCard;
}

export const AssignmentCardComponent: React.FC<AssignmentCardComponentProps> = ({ card }) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(card.route);
    };

    const header = (
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {card.title}
        </h2>
    );

    const body = (
        <p className="text-gray-700 dark:text-gray-300">
            {card.description}
        </p>
    );

    const footer = (
        <button
            onClick={handleClick}
            className="px-6 py-3 rounded-lg w-full font-medium transition-all duration-200 
                       bg-green-500 hover:bg-green-600 text-white 
                       dark:bg-blue-600 dark:hover:bg-blue-700"
        >
            {card.buttonText}
        </button>
    );

    return (
        <Card
            header={header}
            body={body}
            footer={footer}
            className="w-full md:w-[400px] lg:w-[450px] flex flex-col justify-between"
        />
    );
};
