package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.io.Serializable;
import java.util.Base64;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "evaluations")
public class Evaluation implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Columns
    @Column(name = "observations")
    private String observations;

    @Column(name = "recommendations", length = 255)
    private String recommendations;

    @Column(name = "value_judgment", nullable = false, length = 60)
    private String valueJudgment;

    @Column(name = "instructor_signature", nullable = false)
    private byte[] instructorSignature;

    // Relations
    // 1. Relation (1-1) with checklist
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "checklist_id", nullable = false, unique = true)
    private Checklist checklist;

    // Campo para asociar la evaluación a un team scrum específico
    @Column(name = "team_scrum_id")
    private Long teamScrumId;

  

    // Custom methods to handle signature as Base64
    public byte[] getInstructorSignature() {
        return Base64.getEncoder().encodeToString(instructorSignature).getBytes();
    }

    public void setInstructorSignature(byte[] instructorSignature) {
        this.instructorSignature = Base64.getDecoder().decode(instructorSignature);
    }
}
