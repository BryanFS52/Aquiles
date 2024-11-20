package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;

@Setter
@Getter
@EqualsAndHashCode(exclude = {"student", "documentType"})
@ToString(exclude = {"student", "documentType"})
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "people")
@IdClass(PersonKey.class)  // Usamos @IdClass para referenciar la clave compuesta
public class Person implements Serializable {

    @Id
    @Column(nullable = false)  // Este es el id_person
    private Long idPerson;

    @Id
    @Column(nullable = false, unique = true)  // Este es el document
    private Long document;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(nullable = false, length = 80)
    private String lastname;

    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false, length = 10)
    private String bloodType;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(nullable = false, length = 100)
    private String address;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", updatable = false)
    private Date createdAt;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Date updatedAt;

    // Relaciones
    @OneToOne(mappedBy = "person")
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "id_document_type")
    private DocumentType documentType;
}
