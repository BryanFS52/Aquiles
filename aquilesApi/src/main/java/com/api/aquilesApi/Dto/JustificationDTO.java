package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JustificationDTO {
    private Long justificationId;
    private String justificationDescription;
    private String justificationDocument;
}
