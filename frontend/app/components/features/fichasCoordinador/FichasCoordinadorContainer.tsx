'use client';

import React from 'react';
import PageTitle from '@components/UI/pageTitle';
import { AssignmentCardComponent } from './AssignmentCard';
import { AssignmentCard, FichasCoordinadorProps } from './types';

const assignmentCards: AssignmentCard[] = [
    {
        id: 'instructor-tecnico',
        title: 'Asignación de Instructor Técnico',
        description: 'Asigne un instructor técnico a una ficha específica.',
        route: '/InstructorTechnicalAssign',
        buttonText: 'Asignar'
    },
    {
        id: 'instructor-multiple',
        title: 'Asignación de Instructor a Múltiples Fichas',
        description: 'Asigne un instructor a varias fichas simultáneamente.',
        route: '/InstructorAssignMultipleSheets',
        buttonText: 'Asignar'
    }
];

export const FichasCoordinadorContainer: React.FC<FichasCoordinadorProps> = ({
    isDarkMode = false
}) => {
    return (
        <>
            <PageTitle>
                Asignación de Instructores
            </PageTitle>

            <div className="flex flex-col md:flex-row flex-wrap gap-y-12 gap-x-8 items-stretch">
                {assignmentCards.map((card) => (
                    <AssignmentCardComponent
                        key={card.id}
                        card={card}
                        isDarkMode={isDarkMode}
                    />
                ))}
            </div>
        </>
    );
};
