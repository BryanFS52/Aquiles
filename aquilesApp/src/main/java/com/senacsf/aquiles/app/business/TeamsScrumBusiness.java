package com.senacsf.aquiles.app.business; // Declara el paquete al que pertenece esta clase de negocio

import com.senacsf.aquiles.app.dto.TeamsScrumDto; // Importa la clase TeamsScrumDto del paquete dto
import com.senacsf.aquiles.app.entities.Teams_scrum; // Importa la clase Teams_scrum del paquete entities
import com.senacsf.aquiles.app.service.Teams_scrumService; // Importa la clase Teams_scrumService del paquete service
import com.senacsf.aquiles.app.utilities.CustomException; // Importa la clase CustomException del paquete utilities
import org.modelmapper.ModelMapper; // Importa la clase ModelMapper de la biblioteca ModelMapper
import org.springframework.beans.factory.annotation.Autowired; // Importa la anotación Autowired de Spring
import org.springframework.stereotype.Component; // Importa la anotación Component de Spring

import java.util.ArrayList; // Importa la clase ArrayList de java.util para manejar colecciones
import java.util.List; // Importa la clase List de java.util para manejar listas

@Component // Marca esta clase como un componente de Spring
public class TeamsScrumBusiness { // Define una clase de negocio para manejar operaciones relacionadas con TeamsScrum

    @Autowired // Inyecta automáticamente la dependencia de Teams_scrumService
    private Teams_scrumService teamsScrumService; // Variable para acceder al servicio Teams_scrumService

    private final ModelMapper modelMapper = new ModelMapper(); // Instancia de ModelMapper para mapear objetos

    // Método para obtener todos los equipos scrum
    public List<TeamsScrumDto> findAll() {
        try {
            // Obtener la lista de todos los equipos scrum desde el servicio
            List<Teams_scrum> teamsScrumList = teamsScrumService.findAll();
            // Verificar si la lista está vacía
            if (teamsScrumList.isEmpty()) {
                return new ArrayList<>(); // Devolver una lista vacía si no hay equipos scrum
            }
            // Crear una lista de DTOs para almacenar los equipos scrum mapeados
            List<TeamsScrumDto> teamsScrumDtoList = new ArrayList<>();
            // Mapear cada equipo scrum a su respectivo DTO y agregarlo a la lista de DTOs
            teamsScrumList.forEach(teamsScrum -> teamsScrumDtoList.add(modelMapper.map(teamsScrum, TeamsScrumDto.class)));
            return teamsScrumDtoList; // Devolver la lista de DTOs de equipos scrum
        } catch (Exception e) {
            throw new CustomException("Error getting teams scrum"); // Lanzar una excepción personalizada en caso de error
        }
    }

    // Método para obtener un equipo scrum por su ID
    public TeamsScrumDto findTeamById(Long id) {
        try {
            Teams_scrum teamsScrum = teamsScrumService.getById(id); // Obtener el equipo scrum por su ID usando el servicio
            if (teamsScrum == null) {
                throw new CustomException("Teams scrum with id " + id + " not found"); // Lanzar una excepción si el equipo scrum no se encuentra
            }
            return modelMapper.map(teamsScrum, TeamsScrumDto.class); // Mapear la entidad a su DTO y retornarlo
        } catch (Exception e) {
            throw new CustomException("Error getting teams scrum by ID"); // Lanzar una excepción personalizada en caso de error
        }
    }

    // Método para actualizar un equipo scrum
    public void update(TeamsScrumDto teamsScrumDto) {
        try {
            // Mapear el DTO a la entidad Teams_scrum
            Teams_scrum teamsScrum = modelMapper.map(teamsScrumDto, Teams_scrum.class);
            // Guardar o actualizar el equipo scrum usando el servicio
            teamsScrumService.save(teamsScrum);
        } catch (Exception e) {
            throw new CustomException("Error saving teams scrum"); // Lanzar una excepción personalizada en caso de error
        }
    }

    // Método para guardar un nuevo equipo scrum
    public void save(TeamsScrumDto teamsScrumDto) {
        try {
            // Mapear el DTO a la entidad Teams_scrum
            Teams_scrum teamsScrum = modelMapper.map(teamsScrumDto, Teams_scrum.class);
            // Guardar el nuevo equipo scrum usando el servicio
            teamsScrumService.save(teamsScrum);
        } catch (Exception e) {
            throw new CustomException("Error saving teams scrum"); // Lanzar una excepción personalizada en caso de error
        }
    }

    // Método para crear un nuevo equipo scrum
    public void create(TeamsScrumDto teamsScrumDto) {
        try {
            // Verificar si el nombre del proyecto ya existe en la base de datos
            String nameProject = teamsScrumDto.getNameProject();
            Teams_scrum existingProject = teamsScrumService.findByName_project(nameProject);
            if (existingProject != null) {
                throw new CustomException("The project with a name " + nameProject + " already exists."); // Lanzar una excepción si el proyecto ya existe
            }
            // Mapear el DTO a la entidad Teams_scrum
            Teams_scrum teamsScrum = modelMapper.map(teamsScrumDto, Teams_scrum.class);
            // Guardar el nuevo equipo scrum usando el servicio
            teamsScrumService.save(teamsScrum);
        } catch (Exception e) {
            throw new CustomException("Error al guardar"); // Lanzar una excepción personalizada en caso de error
        }
    }

    public void delete(Long teamScrumId) { // Método para eliminar un equipo scrum por su ID
        try {
            Teams_scrum teamsScrum = teamsScrumService.getById(teamScrumId); // Obtener el equipo scrum por su ID usando el servicio
            if (teamsScrum == null) { // Verificar si el equipo scrum no fue encontrado
                throw new CustomException("Teams scrum with id " + teamScrumId + " not found"); // Lanzar una excepción personalizada si el equipo scrum no existe
            }
            teamsScrumService.delete(teamsScrum); // Eliminar el equipo scrum usando el servicio
        } catch (Exception e) { // Capturar cualquier excepción
            System.err.println(e.getMessage()); // Imprimir el mensaje de error en la consola
        }
    }

}
