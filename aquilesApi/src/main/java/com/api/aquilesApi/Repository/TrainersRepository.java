package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.TrainersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigInteger;

public interface TrainersRepository extends JpaRepository<TrainersEntity , Long> {
    TrainersEntity findByDocumentNumber(BigInteger documentNumber);
}
