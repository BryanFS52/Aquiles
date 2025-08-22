package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "checklist_history")
public class ChecklistHistory implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "checklist_id", nullable = false)
    private Long checklistId;

    @Column(name = "actions", nullable = false, length = 255)
    private String actions; // CREATE, UPDATE, DELETE

    @Column(name = "teacher", length = 100)
    private String teacher;

    @Column(name = "date")
    private LocalDateTime date;

    @Column(name = "date_before")
    private String dateBefore;

    @Column(name = "date_after")
    private String dateAfter;

    @PrePersist
    public void onCreate() {
        if (date == null) {
            date = LocalDateTime.now();
        }
    }
}
