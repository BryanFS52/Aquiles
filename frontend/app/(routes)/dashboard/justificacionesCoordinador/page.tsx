"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchAllJustificationStatuses } from '@/redux/slices/justificationStatusSlice';
import PageTitle from "@components/UI/pageTitle";
import JustificationFilters from "@components/features/justifications/justificationsFilter";
import JustificationTable from "@components/features/justifications/justificationsTable";
import {
  fetchJustifications,
  setFilterOptions,
  goToPreviousPage,
  goToNextPage,
  formatErrorMessage,
  setLocalCurrentPage,
  updateJustificationStatus,
  toggleMultiFilter,
  setMultiFilter,
  clearMultiFilters,
  MultiFilterState,
} from '@slice/justificationSlice';

export default function JustificacionesCoordinator() {
  const dispatch = useDispatch<AppDispatch>();
  
  const {
    filteredData,
    loading,
    error,
    totalItems,
    totalPages,
    localCurrentPage,
    filterOptions,
    itemsPerPage
  } = useSelector((state: RootState) => state.justification);

  const { data: justificationStatuses } = useSelector(
    (state: RootState) => state.justificationStatus
  );

  useEffect(() => {
    dispatch(fetchJustifications({ page: 0, size: itemsPerPage }));
    dispatch(fetchAllJustificationStatuses({ page: 0, size: 3 }));
  }, [dispatch, localCurrentPage, itemsPerPage]);

  const handleFilterChange = (filterType: string, value: string) => {
    dispatch(setFilterOptions({ [filterType]: value }));
    dispatch(setLocalCurrentPage(1));
  };

  const handleRefresh = () => {
    dispatch(fetchJustifications({ page: localCurrentPage, size: itemsPerPage }));
  };

  const handleMultiFilterChange = (field: keyof MultiFilterState, value: string) => {
    dispatch(setMultiFilter({ field, value }));
    dispatch(setLocalCurrentPage(1));
  };

  const handleToggleMultiFilter = () => {
    dispatch(toggleMultiFilter());
    dispatch(setLocalCurrentPage(1));
  };

  const handleClearMultiFilters = () => {
    dispatch(clearMultiFilters());
    dispatch(setLocalCurrentPage(1));
  };

  const handlePreviousPage = () => {
    dispatch(goToPreviousPage());
  };

  const handleNextPage = () => {
    dispatch(goToNextPage());
  };

  const handleStatusChange = (justificacionId: string, newStatusId: string) => {
    const selectedStatus = justificationStatuses.find(status => status.id?.toString() === newStatusId);
    const statusName = selectedStatus?.name || "Estado actualizado";

    const currentJustification = filteredData.find((j: any) => j.id.toString() === justificacionId);
    const currentStatusId = currentJustification?.justificationStatus?.toString();

    if (currentStatusId === newStatusId) {
      return;
    }

    dispatch(updateJustificationStatus({
      id: justificacionId,
      statusId: newStatusId,
      statusName: statusName
    }))
      .then((result) => {
        if (updateJustificationStatus.fulfilled.match(result)) {
          showJustificationStatusMessage(statusName);

        } else {
          const error = result.payload as any;
        }
      })
  };

  const showJustificationStatusMessage = (statusName: string) => {
    const statusNameLower = statusName.toLowerCase();

    if (statusNameLower.includes('aprobad') || statusNameLower.includes('acepta')) {
      toast.success(`Justificación aprobada`, {
        position: "top-right",
        autoClose: 5000,
      });
    } else if (statusNameLower.includes('denegad') || statusNameLower.includes('rechaza') || statusNameLower.includes('no acepta')) {
      toast.error(`Justificación denegada`, {
        position: "top-right",
        autoClose: 5000,
      });
    } else if (statusNameLower.includes('proceso') || statusNameLower.includes('pendiente') || statusNameLower.includes('revision')) {
      toast.info(`Justificación está en proceso`, {
        position: "top-right",
        autoClose: 4000,
      });
    } else {
      toast.info(`Estado actualizado: ${statusName}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const errorMessage = formatErrorMessage(error);
  const canGoNext = localCurrentPage < totalPages;
  const canGoPrevious = localCurrentPage > 1;

  const { selectedFiltro, searchTerm, enableMultiFilter, multiFilters } = filterOptions;
  const hasFiltersApplied = Boolean(
    selectedFiltro ||
    searchTerm ||
    (enableMultiFilter && Object.values(multiFilters).some(value => value))
  );

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-0">
      <PageTitle>Justificaciones de aprendices</PageTitle>

      {/* Filters */}
      <JustificationFilters
        filterOptions={filterOptions}
        loading={loading}
        onFilterChange={handleFilterChange}
        onMultiFilterChange={handleMultiFilterChange}
        onToggleMultiFilter={handleToggleMultiFilter}
        onClearMultiFilters={handleClearMultiFilters}
        onRefresh={handleRefresh}
      />

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm sm:text-base text-red-600 dark:text-red-400">{errorMessage}</p>
        </div>
      )}

      {/* Table with built-in empty states */}
      {!errorMessage && (
        <>
          <JustificationTable
            filteredData={filteredData}
            handleStatusChange={handleStatusChange}
            hasAnyData={totalItems > 0}
            isLoading={loading}
            hasError={Boolean(error)}
            hasFiltersApplied={hasFiltersApplied}
            isInstructorView={false}
            justificationStatuses={justificationStatuses}
          />

          {/* Pagination - solo mostrar si hay datos */}
          {!loading && filteredData.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 pt-4 sm:pt-6">
              <button
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-medium text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                onClick={handlePreviousPage}
                disabled={!canGoPrevious}
              >
                <IoIosArrowBack className="mr-2" />
                Anterior
              </button>

              <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center">
                Página {localCurrentPage} de {totalPages} ({totalItems} registros)
              </span>

              <button
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                onClick={handleNextPage}
                disabled={!canGoNext}
              >
                Siguiente
                <IoIosArrowForward className="ml-2" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
