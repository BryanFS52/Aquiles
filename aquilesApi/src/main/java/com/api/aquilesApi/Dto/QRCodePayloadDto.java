package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QRCodePayloadDto {
    private String sessionId;
    private String qrCodeBase64;
    private String qrUrl;
}
