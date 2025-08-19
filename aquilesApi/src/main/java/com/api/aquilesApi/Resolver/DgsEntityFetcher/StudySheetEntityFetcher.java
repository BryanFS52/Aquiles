package com.api.aquilesApi.Resolver.DgsEntityFetcher;

import com.api.aquilesApi.Dto.StudySheet;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsEntityFetcher;

import java.util.Map;

@DgsComponent
public class StudySheetEntityFetcher {
    @DgsEntityFetcher(name = "StudySheet")
    public StudySheet studySheetReference(Map<String, Object> values) {
        String idStr = (String) values.get("id");
        Long id  = Long.parseLong(idStr);
        return new StudySheet(id);
    }
}
