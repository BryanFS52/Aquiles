/*
package com.api.aquilesApi.Resolver.DgsData;

import com.api.aquilesApi.Business.ChecklistBusiness;
import com.api.aquilesApi.Dto.ChecklistDto;
import com.api.aquilesApi.Dto.StudySheet;
import com.api.aquilesApi.Entity.Checklist;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

@DgsComponent
public class CheklistStudySheetData {
    private final ModelMapper modelMapper;
    private final ChecklistBusiness checklistBusiness;

    public CheklistStudySheetData(ModelMapper modelMapper, ChecklistBusiness checklistBusiness) {
        this.modelMapper = modelMapper;
        this.checklistBusiness = checklistBusiness;
    }

    @DgsData(parentType = "StudySheet", field = "checklist" )
    public List<Checklist> checklist(DgsDataFetchingEnvironment dfe) {
        StudySheet studySheet = dfe.getSource();
        assert studySheet != null;
        Long studySheetId = studySheet.getId();

        List<ChecklistDto> dtos = checklistBusiness.findAllByStudySheetId(studySheetId);

        return dtos.stream()
                .map(dto -> modelMapper.map(dto, Checklist.class))
                .collect(Collectors.toList());
    }
}
*/