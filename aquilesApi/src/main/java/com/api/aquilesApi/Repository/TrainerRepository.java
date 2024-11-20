package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigInteger;

public interface TrainerRepository extends JpaRepository<Trainer , Long> {
    Trainer findByDocumentNumber(BigInteger documentNumber);
}
