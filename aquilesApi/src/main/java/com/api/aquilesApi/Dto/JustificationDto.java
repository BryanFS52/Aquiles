package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JustificationDto {
    private Long id;
    private String description;
    private byte[] justificationFile;
    private Date justificationDate;
    private String justificationHistory;
    private Boolean state;
    // Relations
    private Long notificationId;
    private Long justificationTypeId;
}
