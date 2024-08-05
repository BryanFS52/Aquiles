package com.senacsf.aquiles.app.controller; // Declara el paquete al que pertenece esta clase

import com.senacsf.aquiles.app.business.TeamsScrumBusiness; // Importa la clase TeamsScrumBusiness del paquete business
import com.senacsf.aquiles.app.dto.TeamsScrumDto; // Importa la clase TeamsScrumDto del paquete dto.
import org.springframework.beans.factory.annotation.Autowired; // Importa la anotación Autowired de Spring para inyección de dependencias
import org.springframework.web.bind.annotation.*; // Importa las anotaciones para crear un controlador REST

import java.util.List; // Importa la clase List de java.util para trabajar con listas

@RestController // Anotación para definir esta clase como un controlador REST
@RequestMapping("/api/teams-scrum") // Define la ruta base para todas las solicitudes manejadas por este controlador
public class TeamsScrumController {

    @Autowired // Anotación para inyectar automáticamente la dependencia TeamsScrumBusiness
    private TeamsScrumBusiness teamsScrumBusiness; // Declaración del objeto TeamsScrumBusiness

    //Método para mostrar todos los TeamScrum
    @GetMapping("/all") // Anotación para manejar solicitudes GET en la ruta /all
    public List<TeamsScrumDto> getAllTeamsScrum() {
        return teamsScrumBusiness.findAll(); // Llama al método findAll del negocio y devuelve la lista de DTOs de equipos scrum
    }

    // Método para obtener un TeamScrum por su ID
    @GetMapping("/{id}") // Anotación para manejar solicitudes GET en la ruta /{id}
    public TeamsScrumDto getTeamScrumById(@PathVariable("id") Long teamScrumId) {
        return teamsScrumBusiness.findTeamById(teamScrumId); // Llama al método findTeamById del negocio y devuelve el DTO del equipo scrum
    }

    //Método para crear un TeamScrum
    @PostMapping("/create") // Anotación para manejar solicitudes POST en la ruta /create
    public void createTeamScrum(@RequestBody TeamsScrumDto teamsScrumDto) {
        teamsScrumBusiness.create(teamsScrumDto); // Llama al método create del negocio para crear un nuevo equipo scrum
    }

    //Método para actualizar un TeamScrum
    @PutMapping("/update") // Anotación para manejar solicitudes PUT en la ruta /update
    public void updateTeamScrum(@RequestBody TeamsScrumDto teamsScrumDto) {
        teamsScrumBusiness.update(teamsScrumDto); // Llama al método update del negocio para actualizar un equipo scrum
    }

    //Método para borrar un TeamScrum
    @DeleteMapping("/delete/{id}") // Anotación para manejar solicitudes DELETE en la ruta /delete/{id}
    public void deleteTeamScrum(@PathVariable("id") Long teamScrumId) {
        teamsScrumBusiness.delete(teamScrumId); // Llama al método delete del negocio para eliminar el equipo scrum con el ID especificado
    }
}