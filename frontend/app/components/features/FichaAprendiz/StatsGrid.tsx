"use client";

import React from "react";
import { FaUsers, FaRegClock, FaGraduationCap, FaRegListAlt } from "react-icons/fa";
import StatCard from "./StatCard";

interface StudySheet {
  id?: string | number | null;
  number?: string | number | null;
  journey?: {
    name?: string | null;
  } | null;
  trainingProject?: {
    program?: {
      name?: string | null;
    } | null;
  } | null;
}

interface StatsGridProps {
  studySheet: StudySheet;
  studentsCount: number;
}

const StatsGrid: React.FC<StatsGridProps> = ({ studySheet, studentsCount }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {/* Card Ficha */}
      <StatCard
        icon={FaRegListAlt}
        title="Ficha"
        value={studySheet.number?.toString() || 'N/A'}
        gradientFrom="from-primary"
        gradientTo="to-lightGreen"
        iconColor="text-primary"
        sparkleColor="text-lightGreen"
      />

      {/* Card Compañeros */}
      <StatCard
        icon={FaUsers}
        title="Compañeros"
        value={studentsCount}
        gradientFrom="from-lightGreen"
        gradientTo="to-darkGreen"
        iconColor="text-lightGreen"
        sparkleColor="text-darkGreen"
      />

      {/* Card Jornada */}
      <StatCard
        icon={FaRegClock}
        title="Jornada"
        value={studySheet.journey?.name || 'N/A'}
        gradientFrom="from-darkBlue"
        gradientTo="to-secondary"
        iconColor="text-darkBlue"
        sparkleColor="text-secondary"
      />

      {/* Card Programa */}
      <StatCard
        icon={FaGraduationCap}
        title="Programa"
        value={studySheet.trainingProject?.program?.name || 'N/A'}
        gradientFrom="from-secondary"
        gradientTo="to-shadowBlue"
        iconColor="text-secondary"
        sparkleColor="text-shadowBlue"
      />
    </div>
  );
};

export default StatsGrid;
