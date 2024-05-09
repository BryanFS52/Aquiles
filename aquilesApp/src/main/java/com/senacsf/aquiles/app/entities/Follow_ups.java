package com.senacsf.aquiles.app.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.swing.*;
import java.io.Serializable;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "Follow_ups")
public class Follow_ups implements Serializable {

    //creacion de enum para el estado de la del seguimiento
    public enum Enum_State_Follow_Up {
        PLAN_DE_MEJORAMIENTO, DESERCION
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name = "follow_up_id", nullable = false)
    private Long follow_up_id;

    @Column (name = "state", nullable = false)
    private Enum_State_Follow_Up state;

    @ManyToOne(cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_idStudent",referencedColumnName = "student_id")
    private Students fk_idStudent;
}
