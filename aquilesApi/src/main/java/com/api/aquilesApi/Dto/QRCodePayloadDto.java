package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QRCodePayloadDto {
    private String sessionId;
    private String qrCodeBase64;
    private String qrUrl;
}
