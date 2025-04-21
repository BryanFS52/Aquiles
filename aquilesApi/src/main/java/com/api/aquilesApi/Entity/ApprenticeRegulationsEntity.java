package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "apprentice_regulations")
public class ApprenticeRegulationsEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Columns
    @Column(name = "title", nullable = false, length = 80)
    private String title;

    @Column(name = "chapter", nullable = false , length = 80)
    private String chapter;

    @Column(name = "article", nullable = false)
    private String article;

    @Column(name = "paragraph", nullable = false, length = 80)
    private String paragraph;

    // Relations
    // 1. Relation (1-1) con notifications
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "notification_id", referencedColumnName = "id")
    private NotificationsEntity notification;
}
