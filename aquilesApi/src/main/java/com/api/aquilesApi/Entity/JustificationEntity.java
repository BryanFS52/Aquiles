package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Base64;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "justification")
public class JustificationEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Columns
    @Column(name = "documentNumber", nullable = false)
    private String documentNumber;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Lob
    @Column(name = "justification_file", nullable = false)
    private byte[] justificationFile;

    @Column(name = "justification_date", nullable = false)
    private Date justificationDate;

    @Column(name = "state", nullable = false)
    private Boolean state;

    /// TABLA INTERMEDIA OK????
    @Column(name = "justification_history", nullable = false)
    private String justificationHistory;

    // Relations
    // 1.Relation (1-1) con notifications
    @OneToOne(mappedBy = "justification")
    private NotificationsEntity notification;

    // 2.Relation (M-1) con justificationType
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "justification_type_id", nullable = true)
    private JustificationTypeEntity type;

    public String getJustificationFile() {
        return Base64.getEncoder().encodeToString(justificationFile);
    }

    public void setJustificationFile(String justificationFile) {
        this.justificationFile = Base64.getDecoder().decode(justificationFile);
    }
}