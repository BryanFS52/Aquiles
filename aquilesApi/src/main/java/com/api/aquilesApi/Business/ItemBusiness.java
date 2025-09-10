package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ItemDto;
import com.api.aquilesApi.Entity.Item;
import com.api.aquilesApi.Service.ItemService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.ItemMap;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class ItemBusiness {
    private final ItemService itemService;

    public ItemBusiness(ItemService itemService) {
        this.itemService = itemService;
    }

    private void validationObject(ItemDto itemDto) throws CustomException {

    }

    // Get all items (paginated)
    public Page<ItemDto> findAll(int page, int size){
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Item> itemPage = itemService.findAll(pageRequest);
            return ItemMap.INSTANCE.EntityToDTOs(itemPage);
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving item due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving item.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get an item by ID
    public ItemDto findById(Long id){
        try {
            Item item = itemService.getById(id);
            return ItemMap.INSTANCE.EntityToDTO(item);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add a new item
    public ItemDto add(ItemDto itemDto) {
        try {
            Item item = new Item();
            ItemMap.INSTANCE.updateItem(itemDto, item);

            Item savedItem = itemService.save(item);
            return ItemMap.INSTANCE.EntityToDTO(savedItem);

        } catch (Exception e) {
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update an existing item
    public void update(Long itemId, ItemDto itemDto) {
        try {
            itemDto.setId(itemId);
            Item item = itemService.getById(itemId);
            ItemMap.INSTANCE.updateItem(itemDto, item);
            itemService.save(item);
        } catch (Exception e) {
            throw new CustomException("Error Updating Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete an item
    public void delete(Long itemId) {
        try {
            Item item = itemService.getById(itemId);
            itemService.delete(item);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
