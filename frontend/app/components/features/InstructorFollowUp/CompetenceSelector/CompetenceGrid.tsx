"use client";

import React from "react";
import { CardGrid } from "@components/UI/Card";
import { CompetenceOption } from "./UseCompetence";
import CompetenceCard from "./CompetenceCaed";

interface Props {
  competences: CompetenceOption[];
  onSelect: (competence: CompetenceOption) => void;
}

const CompetenceGrid: React.FC<Props> = ({ competences, onSelect }) => (
  <CardGrid
    items={competences}
    renderCard={(competence) => (
      <CompetenceCard
        key={competence.id}
        competence={competence}
        onSelect={onSelect}
        actionLabel="Seguimiento"
      />
    )}
    columns={3}
    pageSize={9}
    filterPlaceholder="Buscar competencia..."
    filterFunction={(item, text) =>
      item.name.toLowerCase().includes(text.toLowerCase()) ||
      Boolean(item.studySheetNumber?.toString().includes(text))
    }
  />
);

export default CompetenceGrid;