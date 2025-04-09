package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "notifications")
public class NotificationsEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Columns
    @Column(name = "title", nullable = false, length = 55)
    private String title;

    @Column(name = "message", nullable = false, length = 255)
    private String message;

    @Column(name = "date_sent", nullable = false, length = 10)
    private Date dateSent;

    @Column(name = "state", nullable = false)
    private Boolean state;

    // Relations

}
