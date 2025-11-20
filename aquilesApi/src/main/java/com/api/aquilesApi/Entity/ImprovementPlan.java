package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "startTime", nullable = false)
    private LocalTime startTime;

    @Column(name = "endTime", nullable = false)
    private LocalTime endTime;

    @Column(name = "place", nullable = false)
    private String place;

    @Column(name = "reason", nullable = false)
    private String reason;

    @Column(name = "objectives", nullable = false)
    private String objectives;

    @Column(name = "state", nullable = false)
    private Boolean state;

    @Column(name = "conclusions", nullable = false)
    private String conclusions;

    // Reference IDs (Gateway)
    @Column (name = "student_id")
    private Long studentId;

    @Column (name = "teacher_competence")
    private Long teacherCompetence;

    @Column (name = "learning_outcome")
    private Long learningOutcome;

    @Column (name = "improvement_plan_file")
    private byte[] improvementPlanFile;

    // Relations
    // 1. Relation (M-1) with improvementPlanActivity
    @OneToMany(mappedBy = "improvementPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImprovementPlanActivity> ImprovementPlanActivities;

    // 2. Relation (M-1) with faultType
    @ManyToOne
    @JoinColumn(name = "fault_type_id", nullable = false)
    private ImprovementPlanFaultType faultType;

    // 3. Relation (1-1) with ImprovementPlanEvaluation (inverse side)
    @OneToOne(mappedBy = "improvementPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private ImprovementPlanEvaluation improvementPlanEvaluation;
}