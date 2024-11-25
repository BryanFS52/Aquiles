package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigInteger;
import java.util.Set;

@NoArgsConstructor
@Getter
@Setter
@Entity  // Asegúrate de que esta anotación esté presente para que JPA reconozca la clase como una entidad
@Table(name = "trainers")
public class Trainer implements Serializable {

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

    // Relación con Attendances (con la nueva clase Trainer)
    @OneToMany(mappedBy = "trainer", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Attendance> attendanceSet;

    @OneToMany(mappedBy = "trainer", fetch = FetchType.LAZY, cascade = CascadeType.ALL) // Relación con Juries
    private Set<Juries> jurieSet;
}
