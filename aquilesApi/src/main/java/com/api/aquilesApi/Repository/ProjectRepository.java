package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity , Long> {
}
