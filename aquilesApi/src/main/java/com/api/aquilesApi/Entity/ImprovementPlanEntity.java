package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "improvement_plan")
public class ImprovementPlanEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Columns
    @Column(name = "city", nullable = false, length = 55)
    private String city;

    @Column(name = "date", nullable = false, length = 10)
    private Date date;

    @Column(name = "reason", nullable = false, length = 255)
    private String reason;

    @Column(name = "number", nullable = false)
    private Integer number;

    @Column(name = "state", nullable = false)
    private Boolean state;

    // Relations
}
