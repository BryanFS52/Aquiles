package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

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
    @JoinColumn(name = "fk_trainer_id", referencedColumnName = "trainer_id") // Esta columna debe referirse a la clave primaria de TrainersEntity
    private TrainersEntity trainer;

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinTable(name = "juries_checklist_substantiation_list", joinColumns = @JoinColumn(name = "fk_check_list_id", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "fk_jury_id", nullable = false)
    )
    private List<ChecklistEntity> list_checklistSubstantiationLists;

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinTable(name = "juries_diary_sustainations", joinColumns = @JoinColumn(name = "fk_diary_id", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "fk_jury_id", nullable = false)
    )

    private List<DiarySustainationsEntity> list_DiarySustainations;
}
