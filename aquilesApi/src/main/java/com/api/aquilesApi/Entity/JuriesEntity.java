package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Set;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "juries")
public class JuriesEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_assigned", length = 30)
    private Date dateAssigned;

    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_trainer_id", referencedColumnName = "trainer_id")
    private TrainersEntity trainer;

    // 1.Relation (M-M) con Checklist
    @ManyToMany(mappedBy = "juries")
    private Set<ChecklistEntity> checklists;

    @ManyToMany
    @JoinTable(
            name = "jury_diary_sustaination",
            joinColumns = @JoinColumn(name = "jury_id"),
            inverseJoinColumns = @JoinColumn(name = "diary_sustaination_id")
    )
    private Set<DiarySustainationsEntity> diarySustainations;

}