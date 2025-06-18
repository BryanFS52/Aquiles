package com.api.aquilesApi.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Set;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "attendances")
public class AttendancesEntity implements Serializable {
    @Transient
    private final SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "attendance_date", nullable = false)
    private Date attendanceDate;

    @Column (name = "student_id")
    private Long studentId;

    // Relations
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_idExcuse", referencedColumnName = "excuseId")
    private ExcusesEntity excuse;

    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "stateAttendance_id", referencedColumnName = "id")
    private AttendanceState attendanceState;

    // 3.Relation (M-M) con notifications
    @ManyToMany(mappedBy = "attendances")
    private Set<NotificationsEntity> notifications;

    public void setAttendanceDate(String attendanceDate) throws ParseException {
        this.attendanceDate = formatter.parse(attendanceDate);
    }

    public String getAttendanceDate() {
        return formatter.format(attendanceDate);
    }
}