package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "notifications")
public class Notifications implements Serializable {
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
    // 1.Relation (1-1) con notifications_type
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "type_id", referencedColumnName = "id")
    private NotificationsType type;

    // 2.Relation (M-M) con attendance
    @ManyToMany
    @JoinTable(
            name = "notification_attendance",
            joinColumns = @JoinColumn(name = "notification_id"),
            inverseJoinColumns = @JoinColumn(name = "attendance_id")
    )
    private Set<Attendance> attendances;

    // 3.Relation (1-1) con justification
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "justification_id", referencedColumnName = "id")
    private Justification justification;

    // 6.Relation (1-1) con finalReport
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "final_report_id", referencedColumnName = "id")
    private FinalReport finalReport;
}