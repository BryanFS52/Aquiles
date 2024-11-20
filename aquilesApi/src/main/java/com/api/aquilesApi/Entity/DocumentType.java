package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Setter
@Getter
@EqualsAndHashCode(exclude = {"people"})
@ToString(exclude = {"people"})
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "document_types")
public class DocumentType implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // El ID es de tipo Long, como en el modelo de Aquiles

    @Column(nullable = false, length = 50, unique = true)
    private String name;  // Nombre del tipo de documento

    @Column(nullable = false, length = 5, unique = true)
    private String acronym;  // Acrónimo del tipo de documento (por ejemplo: "CC" para cédula de ciudadanía)

    @Column(nullable = false, columnDefinition = "boolean default true")
    private Boolean state;  // Estado del tipo de documento (activo/inactivo)

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", updatable = false)
    private Date createdAt;  // Fecha de creación del tipo de documento

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "update_at")
    private Date updatedAt;  // Fecha de última actualización del tipo de documento

    // Relaciones
    @OneToMany(mappedBy = "documentType", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<Person> people;  // Lista de personas asociadas con este tipo de documento
}
