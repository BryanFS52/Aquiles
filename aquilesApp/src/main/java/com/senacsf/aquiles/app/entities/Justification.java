package com.senacsf.aquiles.app.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Set;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "justifications")
public class Justification implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "justification_id", nullable = false)
    private Long justification_id;

    @Column(name = "justification_description", nullable = false, length = 100)
    private String justification_description;

    @Column(name = "justification_document", nullable = false, length = 100)
    private String justification_document;

    @OneToMany(mappedBy = "fk_idJustification", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Attendances> attendanceSet;
}
