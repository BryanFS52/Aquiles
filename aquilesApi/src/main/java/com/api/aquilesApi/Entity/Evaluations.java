package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.io.Serializable;

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

    @OneToOne(mappedBy = "evaluation")
    private Checklist checklist;

    public Checklist getChecklist() {
        return checklist;
    }

    public void setChecklist(Checklist checklist) {
        this.checklist = checklist;
    }
}
