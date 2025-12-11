package com.api.aquilesApi.Resolver.DgsData;

import com.api.aquilesApi.Dto.ImprovementPlanDto;
import com.api.aquilesApi.Entity.ImprovementPlan;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;
import org.modelmapper.ModelMapper;

import java.util.Map;

@DgsComponent
public class LearningOutcomeImprovementPlanData {

    private final ModelMapper modelMapper;

    public LearningOutcomeImprovementPlanData(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @DgsData(field = "learningOutcome", parentType = "ImprovementPlan")
    public Map<String, Object> getLearningOutcome(DgsDataFetchingEnvironment env) {
        try {
            Object source = env.getSource();
            ImprovementPlan improvementPlan;
            if (source instanceof ImprovementPlanDto) {
                improvementPlan = modelMapper.map(source, ImprovementPlan.class);
            } else if (source instanceof ImprovementPlan) {
                improvementPlan = (ImprovementPlan) source;
            } else {
                return null;
            }
            if (improvementPlan.getLearningOutcome() == null) {
                return null;
            }
            return Map.of("id", improvementPlan.getLearningOutcome().toString());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}

