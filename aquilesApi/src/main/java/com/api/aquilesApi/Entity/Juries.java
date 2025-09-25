package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "juries")
public class Juries implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relations
    // 1.Relation (M-M) con Checklist
    /*
    @ManyToMany(mappedBy = "juries")
    private Set<Checklist> checklists;

     */
}