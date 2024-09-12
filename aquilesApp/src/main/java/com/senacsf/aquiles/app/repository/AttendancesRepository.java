package com.senacsf.aquiles.app.repository;

import com.senacsf.aquiles.app.entities.Attendances;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendancesRepository extends JpaRepository<Attendances, Long> {
    // Consulta JPQL ajustada para contar asistentes presentes por entrenador
    @Query("SELECT COUNT(a) FROM Attendances a WHERE a.fk_trainer_id.trainer_id = :trainerId AND a.attendance_state = com.senacsf.aquiles.app.entities.Attendances$Enum_attendance_state.PRESENTE")
    long countPresentByTrainerId(@Param("trainerId") Long trainerId);

    // Consulta JPQL ajustada para contar asistentes ausentes por entrenador
    @Query("SELECT COUNT(a) FROM Attendances a WHERE a.fk_trainer_id.trainer_id = :trainerId AND a.attendance_state = com.senacsf.aquiles.app.entities.Attendances$Enum_attendance_state.FALLA")
    long countAbsentByTrainerId(@Param("trainerId") Long trainerId);
}
