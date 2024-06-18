package com.senacsf.aquiles.app.dto; // Declara el paquete al que pertenece esta clase DTO

import lombok.AllArgsConstructor; // Importa la anotación AllArgsConstructor de Lombok para generar un constructor con todos los argumentos
import lombok.Data; // Importa la anotación Data de Lombok para generar automáticamente getters, setters, toString, equals y hashCode
import lombok.NoArgsConstructor; // Importa la anotación NoArgsConstructor de Lombok para generar un constructor sin argumentos
import java.util.Set; // Importa la clase Set para manejar colecciones

@Data // Anotación de Lombok que combina @Getter, @Setter, @ToString, @EqualsAndHashCode y @RequiredArgsConstructor
@NoArgsConstructor // Anotación de Lombok para generar un constructor sin argumentos
@AllArgsConstructor // Anotación de Lombok para generar un constructor con todos los argumentos
public class ProjectDto { // Define una clase DTO para representar datos de Project

    // Propiedades para almacenar los datos de la entidad Project
    private Long projectId; // ID del proyecto
    private String description; // Descripción del proyecto
    private String problem; // Problema del proyecto
    private String objectives; // Objetivos del proyecto
    private String justification; // Justificación del proyecto
    private Long fk_team_scrum_id; // ID del equipo Scrum asociado
}
