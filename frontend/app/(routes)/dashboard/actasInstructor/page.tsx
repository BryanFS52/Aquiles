"use client";

import React from "react";
import { ActasInstructorContainer } from "@components/features/actasInstructor";
import PageTitle from "@components/UI/pageTitle";

const ActasInstructorPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageTitle>Actas de Cierre de Trimestre</PageTitle>
      <ActasInstructorContainer />
    </div>
  );
};

export default ActasInstructorPage;