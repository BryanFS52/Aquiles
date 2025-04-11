package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "evaluations")
public class EvaluationsEntity implements Serializable {
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
