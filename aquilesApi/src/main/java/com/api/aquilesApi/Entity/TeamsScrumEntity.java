package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "teams_scrum")
public class TeamsScrumEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Columns
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "problem", nullable = false, length = 255)
    private String problem;

    @Column(name = "objectives", nullable = false, length = 255)
    private String objectives;

    @Column(name = "description", nullable = false, length = 255)
    private String description;

    @Column(name = "justification", nullable = false, length = 255)
    private String justification;

    // Relations
    // 1.Relation (M-1) con Checklist
    @ManyToOne
    @JoinColumn(name = "checklist_id", nullable = true)
    private ChecklistEntity checklist;


                // 3. Relation (M-M) con apprentice
                // Guardas solo los IDs de los usuarios
                @ElementCollection
                @CollectionTable(
                        name = "team_scrum_members",
                        joinColumns = @JoinColumn(name = "team_id")
                )
                @Column(name = "user_id")
                private List<Long> memberIds = new ArrayList<>();
            }