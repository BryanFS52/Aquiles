package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "items")
public class Item implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Columns
    @Column(name = "code", nullable = false, length = 15)
    private String code;

    @Column(name = "indicator", nullable = false, length = 100)
    private String indicator;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    // Relations
    // 1. Relation (M-1) with itemType
    @ManyToOne
    @JoinColumn(name = "item_type_id", nullable = false)
    private ItemType itemType;

    // 2. Relation (M-M) with checklist
    @ManyToMany(mappedBy = "items")
    private List<Checklist> checklists;

    // 3. Relation (1-M) with checklistQualification
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChecklistQualification> checklistQualifications;

}