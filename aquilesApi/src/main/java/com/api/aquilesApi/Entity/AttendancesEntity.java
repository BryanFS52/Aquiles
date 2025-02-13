package com.api.aquilesApi.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jdk.jfr.Timestamp;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;
import java.util.Set;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "attendances")
public class AttendancesEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendance_id", nullable = false)
    private Long attendanceId;

    @Timestamp
    @Column(name = "attendance_date", nullable = false)
    private Date attendanceDate;
    //
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_idExcuse", referencedColumnName = "excuse_id")
    private ExcusesEntity excuse;  // Esta es la propiedad a la que mappedBy debe referirse
    //
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_trainer_id", referencedColumnName = "trainer_id")
    private TrainersEntity trainer;
    //
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_idStudent", referencedColumnName = "student_id")
    private StudentsEntity student;
    //
    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "fk_stateAttendance_id", referencedColumnName = "stateAttendance_id")
    private StateAttendanceEntity stateAttendance; // Cambiar a este nombre

}
