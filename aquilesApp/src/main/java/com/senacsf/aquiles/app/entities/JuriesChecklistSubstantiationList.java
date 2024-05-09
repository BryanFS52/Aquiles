package com.senacsf.aquiles.app.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "juries_checklist_substantiation_list")
public class JuriesChecklistSubstantiationList implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "juries_check_list_id", nullable = false)
    private Long juriesCheckListId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_check_list_id", nullable = false)
    private ChecklistSubstantiationList checklistSubstantiationList;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_jury_id", nullable = false)
    private Juries juries;
}
