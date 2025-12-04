package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.ItemType;
import com.api.aquilesApi.Repository.ItemTypeRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ItemTypeService implements Idao<ItemType, Long> {
    private final ItemTypeRepository itemTypeRepository;

    public ItemTypeService(ItemTypeRepository itemTypeRepository) {
        this.itemTypeRepository = itemTypeRepository;
    }

    // Get all ItemTypes paginated
    @Override
    public Page<ItemType> findAll(PageRequest pageRequest) {
        return itemTypeRepository.findAll(pageRequest);
    }

    // Get ItemType by ID or throw exception if not found
    @Override
    public ItemType getById(Long id) {
        return itemTypeRepository.findById(id).orElseThrow(() ->
                new CustomException("ItemType with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    // Update an existing ItemType
    @Override
    public void update(ItemType entity) {
        this.itemTypeRepository.save(entity);
    }

    // Save a ItemType (create or update)
    @Override
    public ItemType save(ItemType entity) {
        return itemTypeRepository.save(entity);
    }

    // Delete a ItemType
    @Override
    public void delete(ItemType entity) {
        this.itemTypeRepository.delete(entity);
    }

    // Create a new ItemType
    @Override
    public void create(ItemType entity) {
        this.itemTypeRepository.save(entity);
    }
}
