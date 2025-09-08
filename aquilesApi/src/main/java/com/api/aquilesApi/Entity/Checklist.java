package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Getter
@Setter
@Table(name = "checklist")
public class Checklist implements Serializable {
    @Transient
    private final SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Columns
    @Column(name = "state", nullable = false)
    private Boolean state;

    @Column(name = "date_assigned", length = 30)
    private LocalDate dateAssigned;

    @Column(name = "competence_quarter", length = 50)
    private Long competenceQuarter;

    // Relations
    // 1. Relation (M-M) with item
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "checklist_items",
            joinColumns = @JoinColumn(name = "checklist_id"),
            inverseJoinColumns = @JoinColumn(name = "item_id")
    )
    private List<Item> items;

    // 2. Relation (1-1) with evaluations
    @OneToOne(mappedBy = "checklist", cascade = CascadeType.ALL, orphanRemoval = true)
    private Evaluations evaluation;

    // 3. Relation (M-M) with teamsScrum
    @ManyToMany
    @JoinTable(
            name = "checklist_teams",
            joinColumns = @JoinColumn(name = "checklist_id"),
            inverseJoinColumns = @JoinColumn(name = "team_id")
    )
    private List<TeamsScrum> teamsScrum;

    // 4. Relation (1-M) with ChecklistQualification
    @OneToMany(mappedBy = "checklist", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChecklistQualification> checklistQualifications;
}