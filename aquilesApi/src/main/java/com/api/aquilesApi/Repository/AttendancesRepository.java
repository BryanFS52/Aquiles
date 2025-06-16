package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.AttendancesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendancesRepository extends JpaRepository<AttendancesEntity, Long> {

    List<AttendancesEntity> findAllByStudentId(Long studentId);


}