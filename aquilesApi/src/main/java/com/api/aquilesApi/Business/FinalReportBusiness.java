package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.FinalReportDto;
import com.api.aquilesApi.Entity.FinalReport;
import com.api.aquilesApi.Service.FinalReportService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.FinalReportMap;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class FinalReportBusiness {
    private final FinalReportService finalReportService;

    public FinalReportBusiness(FinalReportService finalReportService ) {
        this.finalReportService = finalReportService;
    }

    // Validation object
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


    // Get all finalReports (paginated)
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
}
