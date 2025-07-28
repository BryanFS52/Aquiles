package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "item_type")
public class ItemType implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Columns
    @Column(name = "name", nullable = false, length = 20)
    private String name;

    @Column(name = "trimester", nullable = false)
    private String trimester;

    // Relations
    // 1. Relation (1-M) con item
    @OneToMany(mappedBy = "itemType", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Item> items;
}
