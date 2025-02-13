package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.security.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "diary_sustainations")
public class DiarySustainationsEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diary_id", nullable = false)
    private Long diaryId;

    @Column(name = "date_time", nullable = false)
    private LocalDateTime dateTime;

    @Column(name = "place", length = 255)
    private String place;

    @ManyToMany(mappedBy = "list_DiarySustainations", cascade = CascadeType.PERSIST)
    private List<JuriesEntity> juries;
}
