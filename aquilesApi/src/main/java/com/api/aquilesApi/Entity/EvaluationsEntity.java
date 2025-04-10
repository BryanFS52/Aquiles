package com.api.aquilesApi.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.io.Serializable;

public class Evaluations implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Columns
    @Column(name = "observations")
    private String observations;

    @Column(name = "recommendations", length = 255)
    private String recommendations;

    @Column(name = "value_judgment", nullable = false, length = 13)
    private String valueJudgment;

    // Relations

}
