package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "notifications_type")
public class NotificationsType implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Columns
    @Column(name = "name", nullable = false, length = 55)
    private String name;

    @Column(name = "description",nullable = false,length = 255)
    private String description;

    // Relations
    // 1.Relation (1-1) con notifications
    @OneToOne(mappedBy = "type")
    private Notifications notification;
}
