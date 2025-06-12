package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "notifications")
public class NotificationsEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Columns
    @Column(name = "title", nullable = false, length = 55)
    private String title;

    @Column(name = "message", nullable = false, length = 255)
    private String message;

    @Column(name = "date_sent", nullable = false, length = 10)
    private Date dateSent;

    @Column(name = "state", nullable = false)
    private Boolean state;

    // Relations
    // 1.Relation (1-1) con apprenticeRegulations
    @OneToOne(mappedBy = "notification")
    private ApprenticeRegulationsEntity apprenticeRegulations;

    // 2.Relation (1-1) con notifications_type
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "type_id", referencedColumnName = "id")
    private NotificationsTypeEntity type;

    // 3.Relation (M-M) con attendance
    @ManyToMany
    @JoinTable(
            name = "notification_attendance",
            joinColumns = @JoinColumn(name = "notification_id"),
            inverseJoinColumns = @JoinColumn(name = "attendance_id")
    )
    private Set<AttendancesEntity> attendances;

    // 4.Relation (1-1) con justification
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "justification_id", referencedColumnName = "id")
    private JustificationEntity justification;

    // 5.Relation (1-1) con juries
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "jury_id", referencedColumnName = "id")
    private JuriesEntity jury;

    // 6.Relation (1-1) con improvementPlan
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "improvement_plan_id", referencedColumnName = "id")
    private ImprovementPlanEntity improvementPlan;

    // 7.Relation (1-1) con finalReport
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "final_report_id", referencedColumnName = "id")
    private FinalReportEntity finalReport;
}