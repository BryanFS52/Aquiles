package com.api.aquilesApi.Dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.io.Serializable; // Importa Serializable desde java.io

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonDTO implements Serializable {

    @JsonProperty("personKey")
    private PersonKeyDTO personKeyDTO;

    @JsonProperty("name")
    @NotNull(message = "El nombre es obligatorio")
    private String name;

    @JsonProperty("lastname")
    @NotNull(message = "El apellido es obligatorio")
    private String lastname;

    @JsonProperty("dateOfBirth")
    @NotNull(message = "La fecha de nacimiento es obligatoria")
    private LocalDate dateOfBirth;

    @JsonProperty("bloodType")
    @NotNull(message = "El tipo de sangre es obligatorio")
    private String bloodType;

    @JsonProperty("email")
    @Email(message = "El correo electrónico debe ser válido")
    @NotNull(message = "El correo electrónico es obligatorio")
    private String email;

    @JsonProperty("phone")
    @NotNull(message = "El teléfono es obligatorio")
    private String phone;

    @JsonProperty("address")
    @NotNull(message = "La dirección es obligatoria")
    private String address;

    // Relaciones
    @JsonProperty("student")
    private StudentDTO studentDTO;

    @JsonProperty("documentType")
    private DocumentTypeDTO documentTypeDTO;
}
