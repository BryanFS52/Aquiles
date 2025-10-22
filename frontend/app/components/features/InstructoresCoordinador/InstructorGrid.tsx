'use client'

import React from "react"
import InstructorCard, { Instructor } from "./InstructorCard"

interface InstructorGridProps {
    instructors: Instructor[];
}

const InstructorGrid: React.FC<InstructorGridProps> = ({ instructors }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map((inst, idx) => (
                <InstructorCard key={idx} instructor={inst} />
            ))}
        </div>
    )
}

export default InstructorGrid;