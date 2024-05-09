package com.senacsf.aquiles.app.entities;

import jakarta.persistence.*;
import jdk.jfr.Timestamp;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "attendances")
public class Attendances implements Serializable {

    //creacion de enum para el estado de la asistencia
    public enum Enum_attendance_state {
        PRESENTE, RETARDO, FALLA, EXCUSA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name = "attendance_id", nullable = false)
    private Long attendance_id;

    @Timestamp
    @Column (name = "attendance_date", nullable = false)
    private Date attendance_date;

    @Column (name = "attendance_state", nullable = false)
    private Enum_attendance_state attendance_state;

    @ManyToOne(cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_idExcuse",referencedColumnName = "excuse_id")
    private Excuses fk_idExcuse;

    @ManyToOne(cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_trainer_id",referencedColumnName = "trainer_id")
    private Trainers fk_trainer_id;

    @ManyToOne(cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_idStudent",referencedColumnName = "student_id")
    private Students fk_idStudent;
}
