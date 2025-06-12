package com.api.aquilesApi.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jdk.jfr.Timestamp;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
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
    private String attendanceDate;

    // Relations
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_idExcuse", referencedColumnName = "excuseId")
    private ExcusesEntity excuse;

    @Column (name = "student_id")
    private Long student;

    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "stateAttendance_id", referencedColumnName = "id")
    private StateAttendanceEntity stateAttendance;

    // 3.Relation (M-M) con notifications
    @ManyToMany(mappedBy = "attendances")
    private Set<NotificationsEntity> notifications;
}