package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Set;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "justification")
public class Justification implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "justification_id", nullable = false)
    private Long justificationId;

    @Column(name = "justification_description", nullable = false, length = 100)
    private String justificationDescription;

    @Column(name = "justification_document", nullable = false, length = 100)
    private String justificationDocument;

    // Aquí el mappedBy debe hacer referencia a la propiedad "justification" de AttendancesEntity
    @OneToMany(mappedBy = "justification", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Attendance> attendanceSet;
}
