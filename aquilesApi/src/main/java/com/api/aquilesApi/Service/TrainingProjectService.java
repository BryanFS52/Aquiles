package com.api.aquilesApi.Service;

import com.api.aquilesApi.Dto.TrainingProjectResponseDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TrainingProjectService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${olympo.microservice.url:http://localhost:8081}")
    private String olympoBaseUrl;

    public TrainingProjectService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * Obtiene la información de un proyecto formativo desde el microservicio Olympo
     */
    public TrainingProjectResponseDto getTrainingProjectById(Long projectId) {
        try {
            String url = olympoBaseUrl + "/graphql";

            // Construir la consulta GraphQL
            String query = String.format(
                    "{ \"query\": \"{ allTrainingProjects(page: 0, size: 100) { data { id name program { id name } } } }\" }"
            );

            ResponseEntity<String> response = restTemplate.postForEntity(url, query, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode dataNode = rootNode.path("data").path("allTrainingProjects").path("data");

                for (JsonNode projectNode : dataNode) {
                    if (projectNode.path("id").asLong() == projectId) {
                        TrainingProjectResponseDto project = new TrainingProjectResponseDto();
                        project.setId(projectNode.path("id").asLong());
                        project.setName(projectNode.path("name").asText());

                        JsonNode programNode = projectNode.path("program");
                        if (!programNode.isMissingNode()) {
                            TrainingProjectResponseDto.ProgramDto program =
                                    new TrainingProjectResponseDto.ProgramDto();
                            program.setId(programNode.path("id").asLong());
                            program.setName(programNode.path("name").asText());
                            project.setProgram(program);
                        }

                        return project;
                    }
                }
            }

            return null;
        } catch (Exception e) {
            System.err.println("Error fetching training project with ID " + projectId + ": " + e.getMessage());
            return null;
        }
    }

    /**
     * Obtiene solo el nombre del proyecto formativo
     */
    public String getTrainingProjectName(Long projectId) {
        if (projectId == null) {
            return null;
        }

        TrainingProjectResponseDto project = getTrainingProjectById(projectId);
        return project != null ? project.getName() : null;
    }
}