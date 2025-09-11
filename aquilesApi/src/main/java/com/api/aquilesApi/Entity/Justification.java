package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "justification")
public class Justification implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "description")
    private String description;

    @Column(name = "justification_file", nullable = false)
    private byte[] justificationFile;

    @Column(name = "justification_date", nullable = false)
    private LocalDate justificationDate;

    @Column(name = "absence_date")
    private String absenceDate;

    @Column(name = "state", nullable = false)
    private Boolean state;

    // Relations
    // 1.Relation (1-1) with notifications
    @OneToOne(mappedBy = "justification")
    private Notifications notification;

    // 2.Relation (M-1) with justificationType
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "justification_type_id", nullable = true)
    private JustificationType justificationType;

    // 3. Relation (1-1) with attendance
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "attendance_id", referencedColumnName = "id")
    private Attendance attendance;

    // 4. Relation (M-1) with justificationStatus
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "justification_status_id", referencedColumnName = "id")
    private JustificationStatus justificationStatus;

}