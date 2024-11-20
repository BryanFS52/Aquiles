package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Setter
@Getter
@EqualsAndHashCode(exclude = {"offer", "journey", "quarter", "trainingProject", "students"})
@ToString(exclude = {"offer", "journey", "quarter", "trainingProject", "students"})
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "study_sheets")
public class StudySheet implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Integer number;

    @Column(unique = true)
    private Integer num;

    @Column(name = "num_students", nullable = false)
    private Integer numberStudents;

    @Column(name = "start_lective", nullable = false)
    private LocalDate startLective;

    @Column(name = "end_lective", nullable = false)
    private LocalDate endLective;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private Boolean state;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", updatable = false)
    private Date createdAt;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "update_at")
    private Date updatedAt;

    /*
    // Relaciones
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "id_offer", nullable = false)
    private Offer offer;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "id_journey", nullable = false)
    private Journey journey;

    @ManyToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_quarter", nullable = false)
    private Quarter quarter;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "id_training_project", nullable = false)
    private TrainingProject trainingProject;
    */

    @OneToMany(mappedBy = "studySheet", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<Student> students;


}
