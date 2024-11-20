package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.util.Date;

@Setter
@Getter
@EqualsAndHashCode(exclude = {"person", "studySheet", "attendanceSet", "followUpSet", "teamScrum"})
@ToString(exclude = {"person", "studySheet", "attendanceSet", "followUpSet", "teamScrum"})
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "students")
public class Student implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "id_student_sheet", nullable = false, insertable = false, updatable = false)
    private Long idStudentSheet;

    @Column(name = "id_state", nullable = false)
    private Long idState;

    @Column(name = "document_number", nullable = false)
    private Long documentNumber;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", updatable = false)
    private Date createdAt;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Date updatedAt;

    // Relación con Person: Usamos PersonKey para referenciar la clave compuesta
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "id_person", referencedColumnName = "idPerson"),
            @JoinColumn(name = "document", referencedColumnName = "document")
    })
    private Person person;  // Relación con la entidad Person (usando clave compuesta)

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "id_student_sheet", referencedColumnName = "id")
    private StudySheet studySheet;

    // Nueva propiedad 'state' booleana
    @Column(name = "state", nullable = false)
    private Boolean state;  // Estado del estudiante (activo/inactivo, etc.)

    // Relación con TeamScrum
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_scrum_id", referencedColumnName = "team_scrum_id")
    private TeamScrum teamScrum;  // Relación con el equipo Scrum
}
