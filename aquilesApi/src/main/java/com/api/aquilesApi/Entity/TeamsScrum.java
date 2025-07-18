    package com.api.aquilesApi.Entity;

    import com.api.aquilesApi.Dto.TeamScrumMemberId;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Getter;
    import lombok.NoArgsConstructor;
    import lombok.Setter;

    import java.io.Serializable;
    import java.util.ArrayList;
    import java.util.List;

    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    @Setter
    @Entity
    @Table(name = "teams_scrum")
    public class TeamsScrum implements Serializable {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        // Columns
        @Column(name = "team_name", nullable = false, length = 100)
        private String teamName;

        @Column(name = "project_name", nullable = false, length = 100)
        private String projectName;

        @Column(name = "problem", nullable = false, length = 1000)
        private String problem;

        @Column(name = "objectives", nullable = false, length = 1000)
        private String objectives;

        @Column(name = "description", nullable = false, length = 1000)
        private String description;

        @Column(name = "project_justification", nullable = false, length = 1000)
        private String projectJustification;

        // Relations
        // 1.Relation (M-1) con Checklist
        @ManyToOne
        @JoinColumn(name = "checklist_id", nullable = true)
        private Checklist checklist;

        // 2. Relation (M-1) con studySheet
        @Column(name = "study_sheet_id")
        private Long studySheetId;

        // 3. Relation (M-M) con apprentice
        @ElementCollection
        @CollectionTable(
                name = "team_scrum_members",
                joinColumns = @JoinColumn(name = "team_id")
        )
        private List<TeamScrumMemberId> memberIds = new ArrayList<>();
    }