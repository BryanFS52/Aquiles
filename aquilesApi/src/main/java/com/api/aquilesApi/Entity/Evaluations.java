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
public class Evaluations implements Serializable {
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

    // 2. Relation (M-1) with teamsScrum
    @ManyToOne
    @JoinColumn(name = "team_scrum_id", nullable = false)
    private TeamsScrum teamsScrum;

    // Custom methods to handle signature as Base64
    public String getInstructorSignatureBase64() {
        return instructorSignature != null ? Base64.getEncoder().encodeToString(instructorSignature) : null;
    }

    public void setInstructorSignatureFromBase64(String base64Signature) {
        this.instructorSignature = base64Signature != null ? Base64.getDecoder().decode(base64Signature) : null;
    }
}
