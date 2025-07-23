package com.api.aquilesApi.Utilities.MapStruct;

import com.api.aquilesApi.Dto.FollowUpActionDto;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;

@Mapper
public interface FollowUpAction {

    FollowUpAction INSTANCE = Mappers.getMapper(FollowUpAction.class);

    FollowUpActionDto followUpActionToFollowUpActionDto(FollowUpAction followUpAction);

    FollowUpAction followUpActionDtoToFollowUpAction(FollowUpActionDto followUpActionDto);

    List<FollowUpActionDto> followUpActionToFollowUpActionDtos(List<FollowUpAction> followUpActions);

    void updateFollowUpActionFromDto(FollowUpActionDto dto, @MappingTarget FollowUpAction entity);

    default Page<FollowUpActionDto> followUpActionToFollowUpActionDtoPage(Page<FollowUpAction> followUpActions) {
     List<FollowUpActionDto> dtoList = followUpActionToFollowUpActionDtos(followUpActions.getContent());
     return new PageImpl<>(dtoList, followUpActions.getPageable(), followUpActions.getTotalElements());
    }
}