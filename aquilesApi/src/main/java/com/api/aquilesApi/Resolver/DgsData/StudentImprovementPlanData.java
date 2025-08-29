package com.api.aquilesApi.Resolver.DgsData;

import com.api.aquilesApi.Business.ImprovementPlanBusiness;
import com.api.aquilesApi.Dto.Student;
import com.api.aquilesApi.Entity.ImprovementPlan;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;

import java.util.Collections;
import java.util.List;

@DgsComponent
public class StudentImprovementPlanData {

    private final ImprovementPlanBusiness improvementPlanBusiness;

    public StudentImprovementPlanData(ImprovementPlanBusiness improvementPlanBusiness) {
        this.improvementPlanBusiness = improvementPlanBusiness;
    }

    @DgsData(field = "improvementPlans" , parentType = "Student")
    public List<ImprovementPlan> getImprovementPlansForStudent(DgsDataFetchingEnvironment env){
        Student student = env.getSource();
        assert student != null;

        Long studentId = student.getId();
        List<ImprovementPlan> improvementPlanList = improvementPlanBusiness.findAllByStudentId(studentId);
        if (improvementPlanList == null || improvementPlanList.isEmpty()) {
            return Collections.emptyList();
        }
        return improvementPlanList;
    }
}
