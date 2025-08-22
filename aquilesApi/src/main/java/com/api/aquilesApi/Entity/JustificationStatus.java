package com.api.aquilesApi.Entity;

import  jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "justificationStatus")
public class JustificationStatus implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "state")
    private boolean state;

    @OneToMany(mappedBy = "justificationStatus", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Justification> justificationsList;
}
