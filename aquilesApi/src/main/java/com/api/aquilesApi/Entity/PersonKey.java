package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@EqualsAndHashCode
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Embeddable  // Usamos @Embeddable para que esta clase se pueda usar como parte de la clave primaria
public class PersonKey implements Serializable {

    @Column(nullable = false)  // Este es el id_person
    private Long idPerson;

    @Column(nullable = false, unique = true)  // Este es el document
    private Long document;
}
