package com.senacsf.aquiles.app.repository;

import com.senacsf.aquiles.app.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    Project findByDescription(String description);

}
