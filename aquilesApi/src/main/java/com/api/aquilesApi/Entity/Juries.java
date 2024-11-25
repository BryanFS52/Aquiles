package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@NoArgsConstructor
@Getter
@Setter
@Entity  // Asegúrate de que esta anotación esté presente para que JPA reconozca la clase como una entidad
@Table(name = "juries")
public class Juries implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "jury_id", nullable = false)
    private Long juryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_trainer_id", referencedColumnName = "trainer_id") // Referencia a la clave primaria de Trainer
    private Trainer trainer; // Se refiere ahora a la clase Trainer

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinTable(name = "juries_checklist_substantiation_list",
            joinColumns = @JoinColumn(name = "fk_check_list_id", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "fk_jury_id", nullable = false))
    private List<ChecklistSubstantiationList> list_checklistSubstantiationLists; // Ahora se refiere a la clase ChecklistSubstantiationList

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinTable(name = "juries_diary_sustainations",
            joinColumns = @JoinColumn(name = "fk_diary_id", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "fk_jury_id", nullable = false))
    private List<DiarySustainations> list_DiarySustainations; // Aquí se mantiene la relación con DiarySustainations
}
