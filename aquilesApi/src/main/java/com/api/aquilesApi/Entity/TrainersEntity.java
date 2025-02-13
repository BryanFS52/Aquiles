package com.api.aquilesApi.Entity;

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
public class TrainersEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trainer_id", nullable = false)
    private Long trainerId;

    @Column(name = "trainer_state", nullable = false)
    private Boolean trainerState;

    @Column(name = "id_person", nullable = false)
    private Long idPerson;

    @Column(name = "documentNumber", nullable = false)
    private BigInteger documentNumber;

    // Esta es la relación correcta
    @OneToMany(mappedBy = "trainer", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<AttendancesEntity> attendanceSet;

    @OneToMany(mappedBy = "trainer", fetch = FetchType.LAZY, cascade = CascadeType.ALL) // Cambia esto si es necesario
    private Set<JuriesEntity> jurieSet;
}
