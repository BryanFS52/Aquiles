package com.api.aquilesApi.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "state_Follow_up")
public class StateFollow_upsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "state_Follow_up_id", nullable = false)
    private Long stateFollowUpId;

    @Column (name = "status")
    private String status;

    @JsonIgnore
    @OneToMany(mappedBy = "stateFollowUps" ,cascade = CascadeType.ALL ,  fetch = FetchType.LAZY)
    private List<Follow_upsEntity> follow_upsEntityList ;
}
