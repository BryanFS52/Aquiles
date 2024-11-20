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
@Table(name = "attendances")
public class Attendance implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendance_id", nullable = false)
    private Long attendanceId;

    @Column(name = "attendance_date", nullable = false)
    private Date attendanceDate;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_idJustification", referencedColumnName = "justification_id")
    private Justification justification;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_trainer_id", referencedColumnName = "trainer_id")
    private Trainer trainer;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_idStudent", referencedColumnName = "student_id")
    private Student student;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "fk_stateAttendance_id", referencedColumnName = "stateAttendance_id")
    private StateAttendance stateAttendance;

    // Sincronización con estado de excusa
    public void syncExcuseState(StateAttendance pendingExcuseState) {
        if ("Absent".equals(this.stateAttendance.getStatus()) && this.justification == null) {
            this.stateAttendance = pendingExcuseState;
        }
    }
}
