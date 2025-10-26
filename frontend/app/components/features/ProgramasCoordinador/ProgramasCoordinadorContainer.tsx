"use client";

import { useEffect, useState } from 'react';
import { useLoader } from '@context/LoaderContext';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import PageTitle from '@components/UI/pageTitle';
import { fetchPrograms } from '@redux/slices/olympo/programSlice';
import { Program } from '@graphql/generated';
import type { AppDispatch, RootState } from '@redux/store';
import { SearchBar } from './SearchBar';
import { ProgramsGrid } from './ProgramsGrid';
import { Pagination } from './Pagination';

// Constants
const ITEMS_PER_PAGE = 4;

const ProgramasCoordinadorContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: programs, loading, error } = useSelector((state: RootState) => state.program);
  const { showLoader, hideLoader } = useLoader();
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchProgramsData = async (): Promise<void> => {
      showLoader();
      try {
        await dispatch(fetchPrograms({ page: 0, size: 100 })).unwrap();
      } catch (err) {
        toast.error("No se pudieron cargar los programas.");
        console.error(err);
      } finally {
        hideLoader();
      }
    };

    fetchProgramsData();
  }, [dispatch]);

  const filteredPrograms: Program[] = programs.filter((program: Program) =>
    program.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
  );

  const totalPages: number = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE);
  const displayedPrograms: Program[] = filteredPrograms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-0">
      <PageTitle>Programas Coordinación</PageTitle>

      {/* Campo de búsqueda */}
      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        resultsCount={searchTerm ? filteredPrograms.length : undefined}
      />

      {/* Programs Grid */}
      <ProgramsGrid 
        programs={displayedPrograms}
        loading={loading}
        searchTerm={searchTerm}
      />

      {/* Paginación */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default ProgramasCoordinadorContainer;