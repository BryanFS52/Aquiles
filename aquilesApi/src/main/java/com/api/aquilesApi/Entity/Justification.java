package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "justification")
public class Justification implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "description")
    private String description;

    @Column(name = "justification_file", nullable = false)
    private byte[] justificationFile;

    @Column(name = "absence_date", nullable = false)
    private LocalDate absenceDate;

    @Column(name = "justification_date", nullable = false)
    private LocalDate justificationDate;

    @Column(name = "state", nullable = false)
    private Boolean state;

    // Relations
    // 1.Relation (1-1) con notifications
    @OneToOne(mappedBy = "justification")
    private Notifications notification;

    // 2.Relation (M-1) con justificationType
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "justification_type_id", nullable = true)
    private JustificationType justificationType;

    // 3. Relation (1-1) con attendance
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "attendance_id", referencedColumnName = "id")
    private Attendance attendance;

    // 4. Relation (M-1) con justificationStatus
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "justification_status_id", referencedColumnName = "id")
    private JustificationStatus justificationStatus;

    public byte[] getJustificationFile() {
        return Base64.getEncoder().encodeToString(justificationFile).getBytes();
    }

    public void setJustificationFile(byte[] justificationFile) {
        this.justificationFile = Base64.getDecoder().decode(justificationFile);
    }

    public void setAbsenceDate(LocalDate date) {
        this.absenceDate = date;
    }

    public void setAbsenceDate(String dateStr) {
        this.absenceDate = LocalDate.parse(dateStr);
    }

    public void setJustificationDate(LocalDate date) {
        this.justificationDate = date;
    }

    public void setJustificationDate(String dateStr) {
        this.justificationDate = LocalDate.parse(dateStr);
    }

    public String getFormattedJustificationDate() {
        if (this.justificationDate != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            return this.justificationDate.format(formatter);
        }
        return null;
    }

    public String getFormattedAbsenceDate() {
        if (this.absenceDate != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            return this.absenceDate.format(formatter);
        }
        return null;
    }
}