package com.api.aquilesApi.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class    TeamScrumMemberId {
    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "profile_id")
    private String profileId;
}