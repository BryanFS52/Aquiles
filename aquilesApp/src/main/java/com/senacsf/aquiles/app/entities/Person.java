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
@Table(name = "Person")

public class Person implements Serializable{
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column (name = "id_person", nullable = false)
    private Long idPerson;


    @Column (name = "name", nullable = false)
    private  String name;

    @Column (name = "last_name", nullable = false)
    private  String last_name;

    @Column (name = "document", nullable = false)
    private  String document;

    @Column (name = "document_type", nullable = false)
    private String document_type;

    public enum DocumentType {
        TI("Tarjeta Identidad"),
        CC ("Cedula de Ciudadania"),
        CE ("Cedula Extrajera");

        private final String value;

        DocumentType(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }

        @Override
        public String toString() {
            return value;
        }

    }
}
