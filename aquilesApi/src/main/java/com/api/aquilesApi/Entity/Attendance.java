package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "attendances")
public class Attendance implements Serializable {
    @Transient
    private final SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Column (name = "student_id")
    private Long studentId;

    @Column (name = "competence_quarter")
    private Long competenceQuarter;

    // Relations
    // 1. Relation (1-1) with justification
    @OneToOne(mappedBy = "attendance", cascade = CascadeType.ALL)
    private Justification justification;

    // 2. Relation (1-1) with attendanceState
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "stateAttendance_id", referencedColumnName = "id")
    private AttendanceState attendanceState;

    // 3.Relation (M-M) with notifications
    @ManyToMany(mappedBy = "attendances")
    private Set<Notifications> notifications;

}