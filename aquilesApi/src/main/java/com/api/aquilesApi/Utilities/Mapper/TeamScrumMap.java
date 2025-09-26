package com.api.aquilesApi.Utilities.Mapper;

import com.api.aquilesApi.Dto.TeamsScrumDto;
import com.api.aquilesApi.Entity.TeamsScrum;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import java.util.List;

@Mapper(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, uses = {FIleMapper.class})
public interface TeamScrumMap {
    TeamScrumMap INSTANCE = Mappers.getMapper(TeamScrumMap.class);

    TeamsScrumDto EntityToDTO(TeamsScrum teamsScrum);

    TeamsScrum DtoToEntity(TeamsScrumDto teamsScrum);

    List<TeamsScrumDto> EntityToDTOs(List<TeamsScrum> teamsScrums);

    void updateTeamScrum(TeamsScrumDto teamsScrumDto, @MappingTarget TeamsScrum teamsScrum);

    default Page<TeamsScrumDto> EntityToDTOs(Page<TeamsScrum> teamsScrums) {
        List<TeamsScrumDto> dtos = EntityToDTOs(teamsScrums.getContent());
        return new PageImpl<>(dtos, teamsScrums.getPageable(), teamsScrums.getTotalElements());
    }
}
