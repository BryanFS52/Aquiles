package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.AttendanceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendancesRepository extends JpaRepository<AttendanceEntity, Long> {

    List<AttendanceEntity> findAllByStudentId(Long studentId);


}