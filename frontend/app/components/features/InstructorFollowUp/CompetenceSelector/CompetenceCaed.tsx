"use client";

import React from "react";
import { BookOpen, ArrowRight } from "lucide-react";
import { Card } from "@components/UI/Card";
import { CompetenceOption } from "./UseCompetence";


interface Props {
  competence: CompetenceOption;
  onSelect: (competence: CompetenceOption) => void;
  actionLabel?: string;
}

const CompetenceCard: React.FC<Props> = ({ competence, onSelect, actionLabel = "Ver" }) => (
  <Card
    key={competence.id}
    className="hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group"
    header={
      <div className="flex justify-between items-center">
        <BookOpen className="h-6 w-6 text-primary dark:text-secondary group-hover:scale-110 transition-transform duration-200" />
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
          Ficha {competence.studySheetNumber}
        </span>
      </div>
    }
    body={
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary">
          {competence.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Gestionar acciones para esta competencia
        </p>
      </div>
    }
    footer={
      <button
        onClick={() => onSelect(competence)}
        className="w-full flex justify-center items-center gap-2 bg-primary dark:bg-secondary text-white py-2 rounded-lg hover:bg-primary/90 dark:hover:bg-secondary/90 group-hover:scale-105 transition-all duration-200"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </button>
    }
  />
);

export default CompetenceCard;