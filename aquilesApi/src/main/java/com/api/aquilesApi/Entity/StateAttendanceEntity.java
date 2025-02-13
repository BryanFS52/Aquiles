package com.api.aquilesApi.Entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @Column(name = "stateAttendance_id", nullable = false)
    private Long stateAttendanceId;

    @Column (name = "status")
    private String status;

    @JsonIgnore
    @OneToMany(mappedBy = "stateAttendance" ,cascade = CascadeType.ALL ,  fetch = FetchType.LAZY)
    private List<AttendancesEntity> attendancesEntityList;

}
