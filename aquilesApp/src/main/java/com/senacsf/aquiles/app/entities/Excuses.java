package com.senacsf.aquiles.app.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.w3c.dom.Text;

import java.io.Serializable;
import java.util.Set;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "excuses")
public class Excuses implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name = "excuse_id", nullable = false)
    private Long excuse_id;

    @Column(name = "excuse_description", nullable = false,length = 100)
    private String excuse_description;

    @Column(name = "excuse_document", nullable = false,length = 100)
    private String excuse_document;

    @OneToMany (mappedBy = "fk_idExcuse" , fetch = FetchType.LAZY , cascade = CascadeType.ALL)
    private Set<Attendances> attendanceSet;
}
