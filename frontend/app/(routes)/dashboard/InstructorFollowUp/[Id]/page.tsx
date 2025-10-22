'use client';

import React, { use, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { AppDispatch } from '@/redux/store';
import { fetchStudySheetByIdWithAttendances, fetchStudySheetByTeacher } from '@/redux/slices/olympo/studySheetSlice';
import { TEMPORAL_INSTRUCTOR_ID } from '@/temporaryCredential';
import { InstructorFollowUpContainer } from '@/components/features/InstructorFollowUp/InstructorFollowUpContainer';

interface PageProps {
  params: Promise<{ Id: string }>;
}

export default function InstructorFollowUpPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const competenceQuarterId = parseInt(resolvedParams.Id);
  
  const searchParams = useSearchParams();
  const fichaNumber = searchParams.get('ficha');

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (competenceQuarterId && fichaNumber) {
      dispatch(fetchStudySheetByTeacher({ 
        idTeacher: TEMPORAL_INSTRUCTOR_ID, 
        page: 0, 
        size: 20 
      }))
      .unwrap()
      .then((result) => {
        if (!result || !result.data) {
          throw new Error('No data received from fetchStudySheetByTeacher');
        }
        
        const targetFicha = result.data.find((sheet: any) => 
          sheet && sheet.number && sheet.number.toString() === fichaNumber
        );
        
        if (targetFicha && targetFicha.id) {
          const fichaInternalId = targetFicha.id;
          
          return dispatch(fetchStudySheetByIdWithAttendances({
            id: fichaInternalId,
            competenceId: competenceQuarterId,
            teacherId: TEMPORAL_INSTRUCTOR_ID
          })).unwrap();
        } else {
          throw new Error(`Ficha ${fichaNumber} not found in available fichas`);
        }
      })
      .catch((error) => {
        console.error('Error loading study sheet:', error);
      });
    }
  }, [dispatch, competenceQuarterId, fichaNumber]);

  return (
    <InstructorFollowUpContainer
      competenceQuarterId={competenceQuarterId}
      fichaNumber={fichaNumber}
    />
  );
}