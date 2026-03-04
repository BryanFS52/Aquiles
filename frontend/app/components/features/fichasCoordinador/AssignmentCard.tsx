import React from 'react';
import { useRouter } from 'next/navigation';
import { AssignmentCard } from './types';
import { FaArrowRight } from 'react-icons/fa';

interface AssignmentCardComponentProps {
    card: AssignmentCard;
}

export const AssignmentCardComponent: React.FC<AssignmentCardComponentProps> = ({ card }) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(card.route);
    };

    return (
        <div className="group relative bg-white dark:bg-shadowBlue rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-lightGray dark:border-grayText w-full md:w-[400px] lg:w-[450px]">
            {/* Degradado decorativo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-lightGreen/10 dark:from-secondary/10 dark:to-darkBlue/10 rounded-bl-full -z-0"></div>

            {/* Contenido */}
            <div className="relative p-6 z-10 flex flex-col h-full">
                {/* Info de la card */}
                <div className="space-y-4 flex-1">
                    <div>
                        <h3 className="text-2xl font-bold text-primary dark:text-secondary mb-3">
                            {card.title}
                        </h3>
                        <p className="text-base text-grayText dark:text-white leading-relaxed">
                            {card.description}
                        </p>
                    </div>
                </div>

                {/* Botón */}
                <button
                    onClick={handleClick}
                    className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-lightGreen hover:from-primary/90 hover:to-lightGreen/90 dark:from-secondary dark:to-darkBlue dark:hover:from-secondary/90 dark:hover:to-darkBlue/90 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-md"
                >
                    {card.buttonText}
                    <FaArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
