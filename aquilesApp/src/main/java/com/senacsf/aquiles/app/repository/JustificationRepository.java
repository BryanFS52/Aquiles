package com.senacsf.aquiles.app.repository;

import  com.senacsf.aquiles.app.entities.Justification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JustificationRepository extends JpaRepository <Justification, Long> {
}