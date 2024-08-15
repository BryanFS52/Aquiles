package com.senacsf.aquiles.app.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigInteger;
import java.util.Set;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "trainers")
public class Trainers implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trainer_id", nullable = false)
    private Long trainer_id;

    @Column(name = "trainer_state", nullable = false)
    private Boolean trainer_state;

    @Column(name = "id_person", nullable = false)
    private Long id_person;

    @Column(name = "documentNumber", nullable = false)
    private BigInteger documentNumber;

    @OneToMany(mappedBy = "fk_trainer_id", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Attendances> attendanceSet;

    @OneToMany(mappedBy = "fk_trainer_id", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Juries> jurieSet;
}
