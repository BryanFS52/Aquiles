package com.senacsf.aquiles.app.repository;

import com.senacsf.aquiles.app.entities.Trainers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainersRepository extends JpaRepository<Trainers, Long> {
}
