package com.api.aquilesApi.Resolver.DgsData;

import com.api.aquilesApi.Dto.ChecklistDto;
import com.api.aquilesApi.Entity.Checklist;
import com.api.aquilesApi.Utilities.Mapper.ChecklistMap;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;
import java.util.Map;

@DgsComponent
public class ChecklistCompetenceQuarterData {

    @DgsData(parentType = "Checklist")
    public Map<String, Object> competenceQuarter(DgsDataFetchingEnvironment env) {
        try {
            Object source = env.getSource();
            assert source != null;

            Checklist checklist;
            if (source instanceof ChecklistDto) {
                checklist = new Checklist();
                ChecklistMap.INSTANCE.updateChecklist(((ChecklistDto) source), checklist);
            } else {
                checklist = (Checklist) source;
            }

            if (checklist == null || checklist.getCompetenceQuarter() == null) {
                return null;
            }

            return Map.of("id", checklist.getCompetenceQuarter());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error getting Checklist competenceQuarter: " + e.getMessage());
        }
    }
}