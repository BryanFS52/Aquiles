package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ImprovementPlanDeliveryDto;
import com.api.aquilesApi.Entity.ImprovementPlanDelivery;
import com.api.aquilesApi.Service.ImprovementPlanDeliveryService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ImprovementPlanDeliveryBusiness {

    private final ImprovementPlanDeliveryService improvementPlanDeliveryService;
    private final ModelMapper modelMapper;

    public ImprovementPlanDeliveryBusiness(ImprovementPlanDeliveryService deliveryService, ModelMapper modelMapper) {
        this.improvementPlanDeliveryService = deliveryService;
        this.modelMapper = modelMapper;
    }

    public Page<ImprovementPlanDeliveryDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<ImprovementPlanDelivery> deliveryPage = improvementPlanDeliveryService.findAll(pageRequest);

            System.out.println("Total Deliveries found: " + deliveryPage.getTotalElements());

            return deliveryPage.map(entity -> modelMapper.map(entity, ImprovementPlanDeliveryDto.class));
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving improvementPlanDeliveries due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving improvementPlanDeliveries: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ImprovementPlanDeliveryDto findById(Long id) {
        try {
            Optional<ImprovementPlanDelivery> delivery = improvementPlanDeliveryService.findById(id);
            if (delivery.isPresent()) {
                return modelMapper.map(delivery.get(), ImprovementPlanDeliveryDto.class);
            }
            throw new CustomException("ImprovementPlanDelivery not found with id: " + id, HttpStatus.NOT_FOUND);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error retrieving ImprovementPlanDelivery: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public ImprovementPlanDeliveryDto add(ImprovementPlanDeliveryDto deliveryDto) {
        try {
            if (improvementPlanDeliveryService.existsByDeliveryFormat(deliveryDto.getDeliveryFormat())) {
                throw new CustomException("Delivery format already exists: " + deliveryDto.getDeliveryFormat(), HttpStatus.BAD_REQUEST);
            }
            ImprovementPlanDelivery delivery = modelMapper.map(deliveryDto, ImprovementPlanDelivery.class);
            return modelMapper.map(improvementPlanDeliveryService.save(delivery), ImprovementPlanDeliveryDto.class);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error adding ImprovementPlanDelivery: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public void update(Long id, ImprovementPlanDeliveryDto deliveryDto) {
        try {
            Optional<ImprovementPlanDelivery> existing = improvementPlanDeliveryService.findById(id);
            if (!existing.isPresent()) {
                throw new CustomException("ImprovementPlanDelivery not found with id: " + id, HttpStatus.NOT_FOUND);
            }

            if (improvementPlanDeliveryService.existsByDeliveryFormat(deliveryDto.getDeliveryFormat()) &&
                    !existing.get().getDeliveryFormat().equals(deliveryDto.getDeliveryFormat())) {
                throw new CustomException("Delivery format already exists: " + deliveryDto.getDeliveryFormat(), HttpStatus.BAD_REQUEST);
            }

            deliveryDto.setId(id);
            ImprovementPlanDelivery delivery = modelMapper.map(deliveryDto, ImprovementPlanDelivery.class);
            improvementPlanDeliveryService.save(delivery);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error updating ImprovementPlanDelivery: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public void delete(Long id) {
        try {
            Optional<ImprovementPlanDelivery> delivery = improvementPlanDeliveryService.findById(id);
            if (!delivery.isPresent()) {
                throw new CustomException("ImprovementPlanDelivery not found with id: " + id, HttpStatus.NOT_FOUND);
            }
            improvementPlanDeliveryService.deleteById(id);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error deleting ImprovementPlanDelivery: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
