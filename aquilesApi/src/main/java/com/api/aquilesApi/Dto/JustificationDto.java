package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JustificationDto {
    private Long id;
    private String documentNumber;
    private String name;
    private String description;
    private byte[] justificationFile;
    private String justificationDate;
    private Boolean state;
    private String justificationHistory;

    // Relations
    private JustificationTypeDto justificationTypeId;
    private Long notificationId;
}
