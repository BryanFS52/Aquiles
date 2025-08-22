package com.api.aquilesApi.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "stateAttendance")
public class AttendanceState implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column (name = "status")
    private String status;

    // Relations
    @OneToMany(mappedBy = "attendanceState" ,cascade = CascadeType.ALL ,  fetch = FetchType.LAZY)
    private List<Attendance> attendancesEntityList;

}