package com.api.aquilesApi.Resolver.DgsData;

import com.api.aquilesApi.Business.ImprovementPlanBusiness;
import com.api.aquilesApi.Dto.LearningOutcome;
import com.api.aquilesApi.Entity.ImprovementPlan;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;

import java.util.Collections;
import java.util.List;

@DgsComponent
public class ImprovementPlanLearningOutcomeData {

    private final ImprovementPlanBusiness improvementPlanBusiness;

    public ImprovementPlanLearningOutcomeData(ImprovementPlanBusiness improvementPlanBusiness) {
        this.improvementPlanBusiness = improvementPlanBusiness;
    }

    @DgsData(field = "improvementPlans", parentType = "LearningOutcome")
    public List<ImprovementPlan> getImprovementPlansForLearningOutcome(DgsDataFetchingEnvironment env) {
        LearningOutcome learningOutcome = env.getSource();
        assert learningOutcome != null;

        Long learningOutcomeId = learningOutcome.getId();
        List<ImprovementPlan> improvementPlanList = improvementPlanBusiness.findAllByLearningOutcome(learningOutcomeId);
        if (improvementPlanList == null || improvementPlanList.isEmpty()) {
            return Collections.emptyList();
        }
        return improvementPlanList;
    }
}

