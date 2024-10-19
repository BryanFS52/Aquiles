package com.senacsf.aquiles.app.repository;

import com.senacsf.aquiles.app.entities.Attendances;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendancesRepository extends JpaRepository<Attendances, Long> {
    // Consulta JPQL ajustada para contar asistentes presentes por entrenador

    @Query("SELECT COUNT(a) FROM Attendances a WHERE a.fk_trainer_id.trainer_id = :trainerId AND a.fk_stateAttendance.status = 'PRESENTE'")
    long countPresentByTrainerId(@Param("trainerId") Long trainerId);

    @Query("SELECT COUNT(a) FROM Attendances a WHERE a.fk_trainer_id.trainer_id = :trainerId AND a.fk_stateAttendance.status = 'FALLA'")
    long countAbsentByTrainerId(@Param("trainerId") Long trainerId);
}