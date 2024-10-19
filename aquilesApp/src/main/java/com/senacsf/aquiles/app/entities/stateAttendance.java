package com.senacsf.aquiles.app.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "stateAttendance")
public class stateAttendance implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stateAttendance_id", nullable = false)
    private Long stateAttendanceId;

    @Column (name = "status")
    private String status;



}
