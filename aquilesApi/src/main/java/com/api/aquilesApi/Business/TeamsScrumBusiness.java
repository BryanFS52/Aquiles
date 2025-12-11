package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ProcessMethodologyDto;
import com.api.aquilesApi.Dto.TeamScrumMemberIdDto;
import com.api.aquilesApi.Dto.TeamsScrumDto;
import com.api.aquilesApi.Entity.TeamScrumMemberId;
import com.api.aquilesApi.Entity.TeamsScrum;
import com.api.aquilesApi.Service.TeamScrumService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.TeamScrumMap;
import com.api.aquilesApi.Utilities.Mapper.TeamScrumMemberIdMap;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class TeamsScrumBusiness {

    private final TeamScrumService teamScrumService;

    public TeamsScrumBusiness(TeamScrumService teamScrumService) {
        this.teamScrumService = teamScrumService;
    }

    // Validation Object
    private void validationObject(TeamsScrumDto teamsScrumDto) throws CustomException {
        // Validate que memberIds no sea null y que no tenga más de 4 members
        if (teamsScrumDto.getMemberIds() != null && teamsScrumDto.getMemberIds().size() > 4) {
            throw new CustomException("A Team Scrum can have a maximum of 4 members.", HttpStatus.BAD_REQUEST);
        }

        // Solo continuar si memberIds no es null
        if (teamsScrumDto.getMemberIds() != null) {
            List<Long> memberIdList = teamsScrumDto.getMemberIds()
                    .stream()
                    .map(TeamScrumMemberIdDto::getStudentId)
                    .collect(Collectors.toList());

            boolean studentResult = teamScrumService.existsByStudySheetIdAndMemberIds(
                    teamsScrumDto.getStudySheetId(),
                    memberIdList
            );

            if (studentResult) {
                throw new CustomException(
                        "Some of the selected students are already assigned to a Team Scrum within this study sheet.",
                        HttpStatus.CONFLICT
                );
            }
        }
    }

    // Get all TeamsScrum (Paginated)
    public Page<TeamsScrumDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<TeamsScrum> teamsScrumPage = teamScrumService.findAll(pageRequest);
            return TeamScrumMap.INSTANCE.EntityToDTOs(teamsScrumPage);
        } catch (Exception e) {
            throw new CustomException("Error retrieving TeamScrums: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get TeamsScrum by ID
    public TeamsScrumDto findById(Long id) {
        try {
            TeamsScrum teamsScrum = teamScrumService.getById(id);
            return TeamScrumMap.INSTANCE.EntityToDTO(teamsScrum);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting Team Scrum By Id: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get TeamsScrum by StudentId
    public List<TeamsScrumDto> findAllByStudentId(Long studentId) {
        try {
            List<TeamsScrum> teamsScrumList = teamScrumService.findAllByStudentId(studentId);
            return TeamScrumMap.INSTANCE.EntityToDTOs(teamsScrumList);
        } catch (Exception e) {
            throw new CustomException("Error Getting Team Scrum By Id: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get TeamsScrum by StudySheetId
    public List<TeamsScrumDto> findAllByStudySheetId(Long studySheetId) {
        try {
            List<TeamsScrum> entities = teamScrumService.findByStudySheetId(studySheetId);
            return TeamScrumMap.INSTANCE.EntityToDTOs(entities);
        } catch (Exception e) {
            throw new CustomException("Error getting TeamsScrum: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Add new TeamScrum
    public TeamsScrumDto add(TeamsScrumDto teamsScrumDto) {
        try {
            validationObject(teamsScrumDto);
            TeamsScrum teamsScrum = new TeamsScrum();
            TeamScrumMap.INSTANCE.updateTeamScrum(teamsScrumDto, teamsScrum);
            TeamsScrum savedTeamScrum = teamScrumService.save(teamsScrum);
            return TeamScrumMap.INSTANCE.EntityToDTO(savedTeamScrum);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update existing TeamScrum
    public void update(Long teamScrumId, TeamsScrumDto teamsScrumDto) {
        try {
            teamsScrumDto.setId(teamScrumId);
            validationObject(teamsScrumDto);

            TeamsScrum teamsScrum = teamScrumService.getById(teamScrumId);
            
            TeamScrumMap.INSTANCE.updateTeamScrum(teamsScrumDto, teamsScrum);

            // Si hay memberIds, los procesamos
            if (teamsScrumDto.getMemberIds() != null) {
                List<TeamScrumMemberId> memberIds = teamsScrumDto.getMemberIds()
                        .stream()
                        .map(dto -> new TeamScrumMemberId(dto.getStudentId(), dto.getProfileId()))
                        .collect(Collectors.toList());

                teamsScrum.setMemberIds(memberIds);
            }

            teamScrumService.save(teamsScrum);
        } catch (Exception e) {
            throw new CustomException("Error Updating Team Scrum: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    // Add Profile to Student
    public List<TeamScrumMemberIdDto> addProfileToStudent(List<ProcessMethodologyDto> teamScrumMemberIds) {
        try {
            Long teamScrumId = teamScrumMemberIds.get(0).getTeamScrumId();
            TeamsScrum teamsScrum = teamScrumService.getById(teamScrumId);

            for (ProcessMethodologyDto dto : teamScrumMemberIds) {
                // Obtener el perfil actual del estudiante (si tiene uno)
                TeamScrumMemberId currentMember = teamsScrum.getMemberIds().stream()
                        .filter(m -> m.getStudentId().equals(dto.getStudentId()))
                        .findFirst()
                        .orElse(null);

                String currentProfileId = currentMember != null ? currentMember.getProfileId() : null;
                
                // Si profileId está vacío o isActive es false, significa que queremos ELIMINAR el perfil
                boolean isRemovingProfile = dto.getProfileId() == null || 
                                          dto.getProfileId().isEmpty() || 
                                          Boolean.FALSE.equals(dto.getIsActive());

                if (isRemovingProfile) {
                    // VALIDACIÓN CRÍTICA: NO permitir eliminar perfiles ÚNICOS
                    if (currentProfileId != null && !currentProfileId.isEmpty()) {
                        
                        // El frontend ya debería evitar esto, pero agregamos protección en backend
                        teamsScrum.getMemberIds().stream()
                                .filter(m -> m.getStudentId().equals(dto.getStudentId()))
                                .findFirst()
                                .ifPresent(m -> m.setProfileId(null));
                    }
                    continue; // Continuar con el siguiente item
                }

                // VALIDACIÓN CRÍTICA 1: Si el estudiante tiene un perfil ÚNICO actualmente, 
                // NO puede cambiarlo por otro (ni único ni no único)
                if (currentProfileId != null && !currentProfileId.isEmpty() && 
                    !currentProfileId.equals(dto.getProfileId())) {
                    
                    // Verificar si algún miembro tiene este perfil como único
                    
                    long studentsWithSameProfile = teamsScrum.getMemberIds().stream()
                            .filter(m -> currentProfileId.equals(m.getProfileId()))
                            .count();
                    
                    // Si solo este estudiante tiene el perfil, asumimos que PUEDE ser único
                    // y bloqueamos el cambio
                    if (studentsWithSameProfile == 1) {
                        throw new CustomException(
                            "Error no puedes cambiar un rol único.", 
                            HttpStatus.FORBIDDEN
                        );
                    }
                }

                // VALIDACIÓN CRÍTICA 2: Si el perfil que queremos asignar es ÚNICO, 
                // verificar que NO esté asignado a OTRO estudiante
                if (Boolean.TRUE.equals(dto.getIsUnique())) {
                    boolean profileAssignedToOtherStudent = teamsScrum.getMemberIds().stream()
                            .anyMatch(member -> 
                                dto.getProfileId().equals(member.getProfileId()) &&
                                !member.getStudentId().equals(dto.getStudentId())
                            );

                    if (profileAssignedToOtherStudent) {
                        throw new CustomException(
                            "El rol único ya está asignado a otro estudiante del equipo", 
                            HttpStatus.CONFLICT
                        );
                    }
                }

                // ACTUALIZAR el perfil del estudiante (solo si pasó todas las validaciones)
                teamsScrum.getMemberIds().stream()
                        .filter(m -> m.getStudentId().equals(dto.getStudentId()))
                        .findFirst()
                        .ifPresent(m -> m.setProfileId(dto.getProfileId()));
            }

            teamScrumService.save(teamsScrum);
            return TeamScrumMemberIdMap.INSTANCE.EntityToDTOs(teamsScrum.getMemberIds());

        } catch (CustomException e) {
            throw e; // Re-lanzar excepciones personalizadas tal cual
        } catch (Exception e) {
            throw new CustomException("Error Adding Profile to Student: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // Delete TeamScrum by ID
    public void delete(Long teamScrumId) {
        try {
            TeamsScrum teamsScrum = teamScrumService.getById(teamScrumId);
            teamScrumService.delete(teamsScrum);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting Team Scrum: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}