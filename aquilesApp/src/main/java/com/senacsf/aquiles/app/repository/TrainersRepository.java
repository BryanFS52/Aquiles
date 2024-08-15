package com.senacsf.aquiles.app.repository;

import com.senacsf.aquiles.app.entities.Teams_scrum;
import com.senacsf.aquiles.app.entities.Trainers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;

@Repository
public interface TrainersRepository extends JpaRepository<Trainers, Long> {
     Trainers findByDocumentNumber(BigInteger documentNUmber); // Define un método de consulta para buscar un proyecto por su nombre

}
