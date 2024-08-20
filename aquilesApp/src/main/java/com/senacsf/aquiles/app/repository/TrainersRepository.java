package com.senacsf.aquiles.app.repository;

import com.senacsf.aquiles.app.entities.Trainers;
import org.springframework.data.jpa.repository.JpaRepository;
import java.math.BigInteger;

public interface TrainersRepository extends JpaRepository<Trainers, Long> {
     Trainers findByDocumentNumber(BigInteger documentNumber);
}
