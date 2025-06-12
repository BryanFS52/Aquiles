package com.api.aquilesApi.Entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;
@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "stateAttendance")
public class StateAttendanceEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column (name = "status")
    private String status;

    // Relations

    @OneToMany(mappedBy = "stateAttendance" ,cascade = CascadeType.ALL ,  fetch = FetchType.LAZY)
    private List<AttendancesEntity> attendancesEntityList;

}
