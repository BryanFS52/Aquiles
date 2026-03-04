package com.api.aquilesApi.Entity;

import  jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "justificationStatus")
public class JustificationStatus implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "state")
    private boolean state;

    // Relations
    // 1. Relation (1-M) with justification
    @OneToMany(mappedBy = "justificationStatus", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Justification> justificationsList;
}
