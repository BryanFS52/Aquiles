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
public class StateAttendance implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stateAttendance_id", nullable = false)
    private Long stateAttendanceId;

    @Column(name = "status", nullable = false, unique = true)
    private String status; // Ej: Present, Absent, Late, PendingExcuse, ExcuseSent

    @JsonIgnore
    @OneToMany(mappedBy = "stateAttendance", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Attendance> attendanceList;

    // Métodos lógicos para validaciones o transiciones de estados
    public static StateAttendance create(String status) {
        StateAttendance state = new StateAttendance();
        state.setStatus(status);
        return state;
    }
}
