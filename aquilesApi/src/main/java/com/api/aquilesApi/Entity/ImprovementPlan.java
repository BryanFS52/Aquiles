package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.w3c.dom.Text;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "improvement_plan")
public class ImprovementPlan implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "actNumber", nullable = false)
    private String actNumber;

    @Column(name = "city", nullable = false, length = 55)
    private String city;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "startTime", nullable = false)
    private LocalTime startTime;

    @Column(name = "endTime", nullable = false)
    private LocalTime endTime;

    @Column(name = "place", nullable = false, length = 255)
    private String place;

    @Column(name = "reason", nullable = false, length = 255)
    private String reason;

    @Column(name = "objectives", nullable = false, length = 255)
    private String objectives;

    @Column(name = "state", nullable = false)
    private Boolean state;

    @Column(name = "conclusions", nullable = false)
    private String conclusions;

    @Column(name = "qualification", nullable = true)
    private Boolean qualification;

    private Long studentId;

    private Long teacherCompetence;

    // Relations
    // 1. Relation (M-1) with improvementPlanActivity
    @OneToMany(mappedBy = "improvementPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImprovementPlanActivity> ImprovementPlanActivities;

    // 2. Relation (M-M) with improvementPlanEvidenceMap
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "improvement_plan_evidence_map",
            joinColumns = @JoinColumn(name = "improvement_plan_id"),
            inverseJoinColumns = @JoinColumn(name = "evidence_type_id")
    )
    private List<ImprovementPlanEvidenceType> evidenceTypes;

    // 3. Relation (M-1) with faultType
    @ManyToOne
    @JoinColumn(name = "fault_type_id", nullable = false)
    private ImprovementPlanFaultType faultType;
}