package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;
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
    // 1.Relation (M-M) con Checklist
    @ManyToMany(mappedBy = "juries")
    private Set<ChecklistEntity> checklists;
}