package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.ImprovementPlanDelivery;
import com.api.aquilesApi.Repository.ImprovementPlanDeliveryRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ImprovementPlanDeliveryService implements Idao<ImprovementPlanDelivery, Long> {

    private final ImprovementPlanDeliveryRepository deliveryRepository;

    public ImprovementPlanDeliveryService(ImprovementPlanDeliveryRepository deliveryRepository) {
        this.deliveryRepository = deliveryRepository;
    }

    @Override
    public Page<ImprovementPlanDelivery> findAll(PageRequest pageRequest) {
        return deliveryRepository.findAll(pageRequest);
    }

    @Override
    public ImprovementPlanDelivery getById(Long id) {
        return deliveryRepository.findById(id)
                .orElseThrow(() -> new CustomException(
                        "ImprovementPlanDelivery with id " + id + " not found",
                        HttpStatus.NO_CONTENT
                ));
    }

    @Override
    public void update(ImprovementPlanDelivery entity) {
        deliveryRepository.save(entity);
    }

    @Override
    public ImprovementPlanDelivery save(ImprovementPlanDelivery entity) {
        return deliveryRepository.save(entity);
    }

    @Override
    public void delete(ImprovementPlanDelivery entity) {
        deliveryRepository.delete(entity);
    }

    @Override
    public void create(ImprovementPlanDelivery entity) {
        deliveryRepository.save(entity);
    }

    public Optional<ImprovementPlanDelivery> findById(Long id) {
        return deliveryRepository.findById(id);
    }

    public void deleteById(Long id) {
        deliveryRepository.deleteById(id);
    }

    public boolean existsByDeliveryFormat(String deliveryFormat) {
        return deliveryRepository.existsByDeliveryFormat(deliveryFormat);
    }
}
