package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "final_report")
public class FinalReport implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Columns
    @Column(name = "file_number",nullable = false, length = 55)
    private String fileNumber;

    @Column(name = "objetives", nullable = false, length = 255)
    private String objectives;

    @Column(name = "disciplinary_offenses", length = 255)
    private String disciplinaryOffenses;

    @Column(name = "conclusions", nullable = false, length = 255)
    private String conclusions;

    @Lob
    @Column(name = "annexes")
    private byte[] annexes;

    @Lob
    @Column(name = "signature", nullable = false)
    private byte[] firma;

    @Column(name = "state", nullable = false)
    private Boolean state;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "creation_date", updatable = false)
    private Date createdAt;

    // Relations
    // 1.Relation (1-1) with notifications
    @OneToOne(mappedBy = "finalReport")
    private Notifications notification;
}