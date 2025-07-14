package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.FinalReportDto;
import com.api.aquilesApi.Entity.FinalReport;
import com.api.aquilesApi.Service.FinalReportService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class FinalReportBusiness {
    private final FinalReportService finalReportService;
    private final ModelMapper modelMapper;

    public FinalReportBusiness(FinalReportService finalReportService, ModelMapper modelMapper) {
        this.finalReportService = finalReportService;
        this.modelMapper = modelMapper;
    }

    // Validation object


    // Find All
    public Page<FinalReportDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<FinalReport> finalreportEntityPage = finalReportService.findAll(pageRequest);

            System.out.println("Total Attendances: " + finalreportEntityPage.getTotalElements());

            return finalreportEntityPage.map(entity -> modelMapper.map(entity, FinalReportDto.class));
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving finalReport due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving finalReport.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By Id
    public FinalReportDto findById(Long id) {
        try {
            FinalReport finalReport = finalReportService.getById(id);
            return modelMapper.map(finalReport, FinalReportDto.class);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting finalReport: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public FinalReportDto add(FinalReportDto finalreportDto) {
        try {
            System.out.println("FinalReportDto: " + finalreportDto);

                byte[] signatureBytes = java.util.Base64.getDecoder().decode(finalreportDto.getSignature());

            FinalReport finalReport = modelMapper.map(finalreportDto, FinalReport.class);
            finalReport.setFirma(signatureBytes);

            return modelMapper.map(finalReportService.save(finalReport), FinalReportDto.class);
        }catch ( Exception e){
            throw new CustomException(e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long finalReportId, FinalReportDto finalreportDto) {
        try {
            finalreportDto.setId(finalReportId);
            FinalReport attendance = modelMapper.map( finalreportDto, FinalReport.class);
            finalReportService.save(attendance);
        } catch (Exception e) {
            throw new CustomException("Error Updating finalReport: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
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
