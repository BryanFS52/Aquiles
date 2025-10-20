package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.FinalReportDto;
import com.api.aquilesApi.Entity.FinalReport;
import com.api.aquilesApi.Service.FinalReportService;
import com.api.aquilesApi.Service.JasperReportService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.FinalReportMap;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class FinalReportBusiness {

    private final FinalReportService finalReportService;
    private final JasperReportService jasperReportService;

    public FinalReportBusiness(FinalReportService finalReportService, JasperReportService jasperReportService) {
        this.finalReportService = finalReportService;
        this.jasperReportService = jasperReportService;
    }

    // Validation Object
    private void validationObject (FinalReportDto finalreportDto) {
        if (finalreportDto == null) {
            throw new CustomException("The finalReport object is null", HttpStatus.BAD_REQUEST);
        }
        if (finalreportDto.getFileNumber() == null || finalreportDto.getFileNumber().isEmpty()) {
            throw new CustomException("The file number is required", HttpStatus.BAD_REQUEST);
        }
        if (finalreportDto.getObjectives() == null || finalreportDto.getObjectives().isEmpty()) {
            throw new CustomException("The objectives are required", HttpStatus.BAD_REQUEST);
        }
        if (finalreportDto.getConclusions() == null || finalreportDto.getConclusions().isEmpty()) {
            throw new CustomException("The conclusions are required", HttpStatus.BAD_REQUEST);
        }
        if (finalreportDto.getSignature() == null || finalreportDto.getSignature().isEmpty()) {
            throw new CustomException("The signature is required", HttpStatus.BAD_REQUEST);
        }
    }


    // Get all finalReports (Paginated)
    public Page<FinalReportDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<FinalReport> finalreportPage = finalReportService.findAll(pageRequest);
            return FinalReportMap.INSTANCE.EntityToDTOs(finalreportPage);
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving finalReport due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving finalReport.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get finalReport by ID
    public FinalReportDto findById(Long id) {
        try {
            FinalReport finalReport = finalReportService.getById(id);
            return FinalReportMap.INSTANCE.EntityToDTO(finalReport);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting finalReport: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add new finalReport
    public FinalReportDto add(FinalReportDto finalreportDto) {
        try {
            FinalReport finalReport = new FinalReport();
            System.out.println(">>> DTO recibido = " + finalreportDto);
            System.out.println(">>> Annexes recibido = " + finalreportDto.getAnnexes());
            System.out.println(">>> Signature recibido = " + finalreportDto.getSignature());
            FinalReportMap.INSTANCE.updateFinalReport(finalreportDto, finalReport);

            // Set signature
            if (finalReport.getSignature() == null) {
                finalReport.setSignature("SIGNATURE_DEFAULT".getBytes());
            }

            FinalReport savedFinalReport = finalReportService.save(finalReport);
            return FinalReportMap.INSTANCE.EntityToDTO(savedFinalReport);
        }catch ( Exception e){
            e.printStackTrace();
            throw new CustomException(e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Update existing finalReport
    public void update(Long finalReportId, FinalReportDto finalreportDto) {
        try {
            finalreportDto.setId(finalReportId);
            FinalReport finalReport = finalReportService.getById(finalReportId);
            FinalReportMap.INSTANCE.updateFinalReport(finalreportDto, finalReport);
            finalReportService.save(finalReport);
        } catch (Exception e) {
            throw new CustomException("Error Updating finalReport: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete finalReport by ID
    public void delete(Long finalReportId) {
        try {
            FinalReport finalReport = finalReportService.getById(finalReportId);
            finalReportService.delete(finalReport);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting finalReport: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Generate finalReport PDF
    public byte[] generatePdf(Long id) {
        try {
            FinalReportDto dto = findById(id);
            if (dto == null) {
                throw new CustomException("FinalReport not found for ID: " + id, HttpStatus.NOT_FOUND);
            }

            // Construir parámetros para Jasper
            Map<String, Object> params = new HashMap<>();
            params.put("ACTA_NUMERO", dto.getId() != null ? dto.getId().toString() : "N/A");
            params.put("FICHA", dto.getFileNumber());
            params.put("PROGRAMA", "Tecnólogo en Gestión Administrativa");
            params.put("CIUDAD_FECHA", "Bogotá D.C., " + new Date());
            params.put("HORA_INICIO", "08:00");
            params.put("HORA_FIN", "10:00");
            params.put("LUGAR", "SENA - CGA");
            params.put("OBJETIVOS", dto.getObjectives());
            params.put("AGENDA", "Evaluación de trimestre y revisión de compromisos");
            params.put("CONCLUSIONES", dto.getConclusions());
            params.put("COMPROMISOS", dto.getAnnexes() != null ? dto.getAnnexes() : "Sin compromisos");
            params.put("LOGO_PATH", "Reports/images/logo_Sena.png");

            // Inicializar SIGNATURE_IMAGE como null por defecto
            params.put("SIGNATURE_IMAGE", null);

            // Manejo correcto de la imagen de firma
            if (dto.getSignature() != null && !dto.getSignature().isEmpty()) {
                try {
                    // Si es base64, decodificarlo
                    String signatureData = dto.getSignature();
                    if (signatureData.startsWith("data:image/")) {
                        // Remover el prefijo data:image/...;base64,
                        signatureData = signatureData.substring(signatureData.indexOf(",") + 1);
                    }

                    byte[] signatureBytes = Base64.getDecoder().decode(signatureData);

                    // Crear BufferedImage desde los bytes
                    java.io.ByteArrayInputStream bis = new java.io.ByteArrayInputStream(signatureBytes);
                    java.awt.image.BufferedImage bufferedImage = javax.imageio.ImageIO.read(bis);

                    if (bufferedImage != null) {
                        params.put("SIGNATURE_IMAGE", bufferedImage);
                        System.out.println("✅ Imagen de firma cargada correctamente");
                    } else {
                        System.out.println("⚠️ No se pudo cargar la imagen de firma");
                    }
                } catch (Exception e) {
                    System.out.println("❌ Error procesando firma: " + e.getMessage());
                }
            } else {
                System.out.println("ℹ️ No hay firma disponible para el reporte");
            }

            // Sin datasource por ahora
            return jasperReportService.generate("finalReport.jrxml", params, Collections.emptyList(), JasperReportService.ExportType.PDF);

        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException("Error generating PDF: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}