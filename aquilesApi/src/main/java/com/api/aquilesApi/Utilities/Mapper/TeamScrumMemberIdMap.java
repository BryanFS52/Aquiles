package com.api.aquilesApi.Utilities.Mapper;

import com.api.aquilesApi.Dto.TeamScrumMemberIdDto;
import com.api.aquilesApi.Entity.TeamScrumMemberId;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import java.util.List;

@Mapper(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TeamScrumMemberIdMap {
    TeamScrumMemberIdMap INSTANCE = Mappers.getMapper(TeamScrumMemberIdMap.class);

    TeamScrumMemberIdDto EntityToDto(TeamScrumMemberId teamScrumMemberId);

    TeamScrumMemberId DtoToEntity(TeamScrumMemberIdDto teamScrumMemberIdDto);

    List<TeamScrumMemberIdDto> EntityToDTOs(List<TeamScrumMemberId> teamScrumMemberIds);

    void updateTeamScrumMemberId(TeamScrumMemberIdDto teamScrumMemberIdDto, @MappingTarget TeamScrumMemberId teamScrumMemberId);

    default Page<TeamScrumMemberIdDto> EntityToDTOs(Page<TeamScrumMemberId> teamScrumMemberIds) {
        List<TeamScrumMemberIdDto> dtos = EntityToDTOs(teamScrumMemberIds.getContent());
        return new PageImpl<>(dtos, teamScrumMemberIds.getPageable(), teamScrumMemberIds.getTotalElements());
    }
}
