package com.senacsf.aquiles.app.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "juries_diary_sustainations")
public class JuriesDiarySustainations implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "juries_diary_id", nullable = false)
    private Long juriesDiaryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_jury_id", nullable = false)
    private Juries juries;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_diary_id", nullable = false)
    private DiarySustainations diarySustainations;
}
