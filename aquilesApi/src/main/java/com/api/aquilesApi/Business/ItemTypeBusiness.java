package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ItemTypeDto;
import com.api.aquilesApi.Entity.Item;
import com.api.aquilesApi.Entity.ItemType;
import com.api.aquilesApi.Service.ItemService;
import com.api.aquilesApi.Service.ItemTypeService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.ItemTypeMap;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class ItemTypeBusiness {
    private final ItemTypeService itemTypeService;

    public ItemTypeBusiness(ItemTypeService itemTypeService) {
        this.itemTypeService = itemTypeService;
    }

    // Get all item types (paginated)
    public Page<ItemTypeDto> findAll(int page, int size){
        try {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<ItemType> itemTypePage = itemTypeService.findAll(pageRequest);
        return ItemTypeMap.INSTANCE.EntityToDTOs(itemTypePage);
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving itemType due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving itemType.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get an item type by ID
    public ItemTypeDto findById(Long id){
        try {
            ItemType itemType = itemTypeService.getById(id);
            return ItemTypeMap.INSTANCE.EntityToDTO(itemType);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting ItemType: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add a new item type
    public ItemTypeDto add(ItemTypeDto itemTypeDto){
        try {
            ItemType itemType = new ItemType();
            ItemTypeMap.INSTANCE.updateItemType(itemTypeDto, itemType);
            ItemType savedItemType = itemTypeService.save(itemType);
            return ItemTypeMap.INSTANCE.EntityToDTO(savedItemType);

        } catch (Exception e) {
            throw new CustomException("Error Adding Item Type: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update an existing item type
    public void update(Long itemTypeId, ItemTypeDto itemTypeDto){
        try {
            itemTypeDto.setId(itemTypeId);
            ItemType itemType = itemTypeService.getById(itemTypeId);
            ItemTypeMap.INSTANCE.updateItemType(itemTypeDto, itemType);
            itemTypeService.save(itemType);
        } catch (Exception e) {
            throw new CustomException("Error Updating itemType: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete an item type
    public void delete(Long itemTypeId){
        try {
            ItemType itemType = itemTypeService.getById(itemTypeId);
            itemTypeService.delete(itemType);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting ItemType: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
