package com.senacsf.aquiles.app.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "diary_susta  inations")
    public class DiarySustainations implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diary_id", nullable = false)
    private Long diaryId;

    @Column(name = "date_time", nullable = false)
    private Timestamp dateTime;

    @Column(name = "place", length = 255)
    private String place;

    @ManyToMany(mappedBy = "list_DiarySustainations", cascade = CascadeType.PERSIST)
    private List<Juries> juries;
}
