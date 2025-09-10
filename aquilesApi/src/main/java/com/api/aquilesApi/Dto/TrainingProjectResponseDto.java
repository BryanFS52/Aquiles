package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainingProjectResponseDto {
    private Long id;
    private String name;
    private String description;
    private ProgramDto program;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProgramDto {
        private Long id;
        private String name;
    }
}
