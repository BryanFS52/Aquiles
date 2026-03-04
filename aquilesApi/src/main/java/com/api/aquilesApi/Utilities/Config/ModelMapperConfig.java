package com.api.aquilesApi.Utilities.Config;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        
        // Configuraciones básicas
        modelMapper.getConfiguration()
            .setSkipNullEnabled(true)
            .setMatchingStrategy(MatchingStrategies.STRICT)
            .setAmbiguityIgnored(true); // Esto ignora las ambigüedades en el mapeo
        
        return modelMapper;
    }
}
