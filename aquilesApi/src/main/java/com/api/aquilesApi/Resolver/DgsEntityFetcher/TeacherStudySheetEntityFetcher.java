package com.api.aquilesApi.Resolver.DgsEntityFetcher;

import com.api.aquilesApi.Dto.TeacherStudySheet;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsEntityFetcher;

import java.util.Map;

@DgsComponent
public class TeacherStudySheetEntityFetcher {

    @DgsEntityFetcher(name = "TeacherStudySheet")
    public TeacherStudySheet getTeacherStudySheet(Map<String, Object> values){
        Long id = null;
        if (values.get("id") instanceof String) {
            id = Long.valueOf((String) values.get("id"));
        } else if (values.get("id") instanceof Integer) {
            id = ((Integer) values.get("id")).longValue();
        } else if (values.get("id") instanceof Long) {
            id = (Long) values.get("id");
        }

        if (id == null) return null;

        TeacherStudySheet teacherStudySheet = new TeacherStudySheet();
        teacherStudySheet.setId(id);
        return teacherStudySheet;
    }

}
