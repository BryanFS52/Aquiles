package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class LearningOutcomeEntity implements Serializable {
//    (Model)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relations
    // 1.Relation (M-1) con checklist
    @ManyToOne
    @JoinColumn(name = "checklist_id", nullable = false)
    private ChecklistEntity checklist;
}