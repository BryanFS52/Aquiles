package com.senacsf.aquiles.app.repository;

import java.math.BigInteger;

import org.springframework.data.jpa.repository.JpaRepository;

import com.senacsf.aquiles.app.entities.Trainers;

public interface TrainersRepository extends JpaRepository<Trainers, Long> {
     Trainers findByDocumentNumber(BigInteger documentNumber); // Define un método de consulta para buscar un proyecto por su nombre
}
