package com.api.aquilesApi.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Entity
@NoArgsConstructor
@Getter
@Setter
@Table(name = "Follow_ups")
public class Follow_upsEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "follow_up_id", nullable = false)
    private Long followUpId;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_idStudent", referencedColumnName = "student_id")
    private StudentsEntity fk_idStudent;


    // Relación con State_Follow_Up
    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "fk_stateFollowUp_id", referencedColumnName = "state_Follow_up_id")
    private StateFollow_upsEntity stateFollowUps; // Cambiado a este nombre
}
