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
@Table(name = "items")
public class ItemEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Columns
    @Column(name = "code", nullable = false, length = 15)
    private String code;

    @Column(name = "indicator", nullable = false, length = 100)
    private String indicator;

    //Relations
    // 1. Relation (M-1) con itemType
    @ManyToOne
    @JoinColumn(name = "item_type_id", nullable = false)
    private ItemTypeEntity itemType;

    // 2. Relation (M-1) con checklist
    @ManyToOne
    @JoinColumn(name = "checklist_id", nullable = false)
    private ChecklistEntity checklist;

}