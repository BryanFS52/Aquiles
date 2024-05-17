package com.senacsf.aquiles.app.dto; // Declara el paquete al que pertenece esta clase DTO

import lombok.AllArgsConstructor; // Importa la anotación AllArgsConstructor de Lombok para generar un constructor con todos los argumentos
import lombok.Data; // Importa la anotación Data de Lombok para generar automáticamente getters, setters, toString, equals y hashCode
import lombok.NoArgsConstructor; // Importa la anotación NoArgsConstructor de Lombok para generar un constructor sin argumentos

@Data // Anotación de Lombok que combina @Getter, @Setter, @ToString, @EqualsAndHashCode y @RequiredArgsConstructor
@NoArgsConstructor // Anotación de Lombok para generar un constructor sin argumentos
@AllArgsConstructor // Anotación de Lombok para generar un constructor con todos los argumentos
public class TeamsScrumDto { // Define una clase DTO para representar datos de TeamsScrum

    private Long team_scrum_id; // Propiedad para almacenar el ID del equipo scrum

    private String nameProject; // Propiedad para almacenar el nombre del proyecto
}
