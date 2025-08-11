package com.api.aquilesApi.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TeamScrumMemberId {
    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "profile_id")
    private String profileId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TeamScrumMemberId)) return false;
        TeamScrumMemberId that = (TeamScrumMemberId) o;
        return Objects.equals(studentId, that.studentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(studentId);
    }
}