package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "final_report")
public class FinalReport implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Columns
    @Column(name = "file_number",nullable = false, length = 55)
    private String fileNumber;

    @Column(name = "objetives", nullable = false, length = 255)
    private String objectives;

    @Column(name = "disciplinary_offenses", length = 255)
    private String disciplinaryOffenses;

    @Column(name = "conclusions", nullable = false, length = 255)
    private String conclusions;

    @Column(name = "annexes")
    private byte[] annexes;

    @Column(name = "signature")
    private byte[] signature;

    @Column(name = "state", nullable = false)
    private Boolean state;

    @Column (name = "competence_quarter")
    private Long competenceQuarter;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "creation_date", updatable = false)
    private Date createdAt;

    // Relations
    // 1.Relation (1-1) with notifications
    @OneToOne(mappedBy = "finalReport")
    private Notifications notification;
}