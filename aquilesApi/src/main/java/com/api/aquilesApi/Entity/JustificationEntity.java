package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
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
@Entity
@Table(name = "justification")
public class JustificationEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @Column(name = "description")
    private String description;

    @Lob
    @Column(name = "justification_file", nullable = false)
    private byte[] justificationFile;

    @Column(name = "justification_date", nullable = false)
    private LocalDate justificationDate;

    @Column(name = "state", nullable = false)
    private Boolean state;

    // Relations
    // 1.Relation (1-1) con notifications
    @OneToOne(mappedBy = "justification")
    private NotificationsEntity notification;

    // 2.Relation (M-1) con justificationType
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "justification_type_id", nullable = true)
    private JustificationTypeEntity justificationTypeId;

    // 3. Relation (1-1) con attendance
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "attendance_id", referencedColumnName = "id")
    private AttendanceEntity attendance;

    public String getJustificationFile() {
        return Base64.getEncoder().encodeToString(justificationFile);
    }

    public void setJustificationFile(String justificationFile) {
        this.justificationFile = Base64.getDecoder().decode(justificationFile);
    }

    public void setJustificationDate(String justificationDateString) {

        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
        this.justificationDate = LocalDate.parse(justificationDateString);
    }

}