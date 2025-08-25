package com.api.aquilesApi.Resolver.DgsData;

import com.api.aquilesApi.Business.ImprovementPlanBusiness;
import com.api.aquilesApi.Dto.TeacherStudySheet;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@DgsComponent
public class CompetenceTeacherImprovementPlanData {

    private final ImprovementPlanBusiness improvementPlanBusiness;

    public CompetenceTeacherImprovementPlanData(ImprovementPlanBusiness improvementPlanBusiness) {
        this.improvementPlanBusiness = improvementPlanBusiness;
    }

    @DgsData(field = "improvementPlans", parentType = "TeacherStudySheet")
    public List<Map<String, Object>> getImprovementPlansForTeacher(DgsDataFetchingEnvironment env) {
        TeacherStudySheet teacherStudySheet = env.getSource();
        assert teacherStudySheet != null;

        Long teacherId = teacherStudySheet.getId();
        List<Long> improvementPlanIds = improvementPlanBusiness.findAllByTeacherCompetence(teacherId);

        if (improvementPlanIds == null || improvementPlanIds.isEmpty()) {
            return Collections.emptyList();
        }

        // Convertir los IDs a objetos de representación para GraphQL Federation
        return improvementPlanIds.stream()
                .map(id -> Map.<String, Object>of("id", id.toString()))
                .toList();
    }
}