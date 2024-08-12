package com.senacsf.aquiles.app.service; // Declara el paquete al que pertenece esta clase

import com.senacsf.aquiles.app.entities.Teams_scrum; // Importa la entidad Teams_scrum
import com.senacsf.aquiles.app.repository.Teams_scrumRepository; // Importa el repositorio de Teams_scrum
import com.senacsf.aquiles.app.service.dao.Idao; // Importa la interfaz Idao
import org.springframework.beans.factory.annotation.Autowired; // Importa la anotación Autowired de Spring
import org.springframework.stereotype.Service; // Importa la anotación Service de Spring
import org.springframework.transaction.annotation.Transactional;

import java.util.List; // Importa la clase List de java.util para trabajar con listas
import java.util.Optional; // Importa la clase Optional de java.util para manejar valores que pueden estar presentes o ausentes

@Service // Marca esta clase como un servicio de Spring
public class Teams_scrumService implements Idao<Teams_scrum, Long> { // Implementa la interfaz Idao con Teams_scrum como entidad y Long como tipo de ID

    @Autowired // Inyecta automáticamente el repositorio Teams_scrumRepository
    Teams_scrumRepository teamsScrumRepository;

    // Método para encontrar un equipo scrum por el nombre del proyecto
    @Transactional(readOnly = false)
    public Teams_scrum findByName_project(String name_project) {
        return teamsScrumRepository.findByNameProject(name_project); // Llama al método del repositorio para encontrar un equipo scrum por el nombre del proyecto
    }

    @Override
    @Transactional(readOnly = false)
    public List<Teams_scrum> findAll() {
        return teamsScrumRepository.findAll(); // Llama al método del repositorio para obtener todas las instancias de Teams_scrum desde la base de datos
    }

    @Override
    @Transactional(readOnly = false)
    public Teams_scrum getById(Long id) {
        Optional<Teams_scrum> optionalTeam = teamsScrumRepository.findById(id); // Usa Optional para manejar el posible valor nulo al buscar por ID
        return optionalTeam.orElse(null); // Retorna el equipo scrum si está presente, de lo contrario retorna null
    }

    @Override
    @Transactional(readOnly = false)
    public void update(Teams_scrum entity) {
        this.teamsScrumRepository.save(entity); // Guarda la instancia actualizada de Teams_scrum en la base de datos usando el repositorio
    }

    @Override
    @Transactional(readOnly = false)
    public Teams_scrum save(Teams_scrum entity) {
        return this.teamsScrumRepository.save(entity); // Guarda la nueva instancia de Teams_scrum o actualiza una existente en la base de datos y la retorna
    }

    @Override
    @Transactional(readOnly = false)
    public void create(Teams_scrum entity) {
        this.teamsScrumRepository.save(entity); // Crea y guarda una nueva instancia de Teams_scrum en la base de datos usando el repositorio
    }

    @Override
    @Transactional(readOnly = false)
    public void delete(Teams_scrum entity) {
        this.teamsScrumRepository.delete(entity); // Elimina la instancia de Teams_scrum de la base de datos usando el repositorio
    }
}