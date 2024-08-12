package com.senacsf.aquiles.app.controller; // Declara el paquete al que pertenecer esta clase

import com.senacsf.aquiles.app.business.TeamsScrumBusiness; // Importa la clase TeamsScrumBusiness del paquete business
import com.senacsf.aquiles.app.dto.TeamsScrumDto; // Importa la clase TeamsScrumDto del paquete dto.
import com.senacsf.aquiles.app.utilities.CustomException;
import org.springframework.beans.factory.annotation.Autowired; // Importa la anotación Autowired de Spring para inyección de dependencias
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*; // Importa las anotaciones para crear un controlador REST

import java.util.HashMap;
import java.util.List; // Importa la clase List de java.util para trabajar con listas
import java.util.Map;

@RestController // Anotación para definir esta clase como un controlador REST
@RequestMapping("/api/teams-scrum") // Define la ruta base para todas las solicitudes manejadas por este controlador
public class TeamsScrumController {

    @Autowired // Anotación para inyectar automáticamente la dependencia TeamsScrumBusiness
    private TeamsScrumBusiness teamsScrumBusiness; // Declaración del objeto TeamsScrumBusiness

    //Método para mostrar todos los TeamScrum
    @GetMapping("/all") // Anotación para manejar solicitudes GET en la ruta /all
    public ResponseEntity<List<TeamsScrumDto>> getAllTeamsScrum() {
        List<TeamsScrumDto> teamsScrumList = teamsScrumBusiness.findAll();

        if (teamsScrumList.isEmpty()) {
            return ResponseEntity.noContent().build(); // Devuelve 204 No Content si la lista está vacía
        } else {
            return ResponseEntity.ok(teamsScrumList); // Devuelve 200 OK con la lista de DTOs si no está vacía
        }
    }

    // Método para obtener un TeamScrum por su ID
    @GetMapping("/{id}") // Anotación para manejar solicitudes GET en la ruta /{id}
    public ResponseEntity<Map<String, Object>> getTeamScrumById(@PathVariable Long id) {
        try {
            TeamsScrumDto team = teamsScrumBusiness.findTeamById(id);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("data", team);
            response.put("code" , 200);
            return ResponseEntity.ok(response);
        } catch (CustomException e) {
            return handleException(e);
        }
    }

    //Método para crear un TeamScrum
    @PostMapping("/create") // Anotación para manejar solicitudes POST en la ruta /create
    public ResponseEntity<Map<String, Object>> createTeamScrum(@Validated @RequestBody TeamsScrumDto teamsScrumDto) {
        try {
            teamsScrumBusiness.create(teamsScrumDto);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Team Scrum created successfully");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (CustomException e) {
            return handleException(e);
        }
    }

    //Método para actualizar un TeamScrum
    @PutMapping("/update") // Anotación para manejar solicitudes PUT en la ruta /update
    public ResponseEntity<Map<String, Object>> updateTeamScrum(@Validated @RequestBody TeamsScrumDto teamsScrumDto) {
        try {
            teamsScrumBusiness.update(teamsScrumDto);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Team Scrum updated successfully");
            return ResponseEntity.ok(response);
        } catch (CustomException e) {
            return handleException(e);
        }
    }

    //Método para borrar un TeamScrum
    @DeleteMapping("/delete/{id}") // Anotación para manejar solicitudes DELETE en la ruta /delete/{id}
    public ResponseEntity<Map<String, Object>> deleteTeamScrum(@PathVariable Long id) {
        try {
            teamsScrumBusiness.delete(id);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Team Scrum deleted successfully");
            return ResponseEntity.ok(response);
        } catch (CustomException e) {
            return handleException(e);
        }
    }
    private ResponseEntity<Map<String, Object>> handleException(CustomException e) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", e.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}