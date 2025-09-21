package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.Item;
import com.api.aquilesApi.Repository.ItemRepository;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public Page<Item> findAll(PageRequest pageRequest) {
        try {
            return itemRepository.findAll(pageRequest);
        } catch (Exception e) {
            System.err.println("Error using findAllWithRelations, falling back to regular findAll: " + e.getMessage());
            return itemRepository.findAll(pageRequest);
        }
    }

    public Item findById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new CustomException("Item with ID " + id + " not found", HttpStatus.NOT_FOUND));
    }

    public Item save(Item item) {
        return itemRepository.save(item);
    }

    public Item updateStatus(Long itemId, Boolean active) {
        Item item = findById(itemId);
        item.setActive(active);
        return save(item);
    }

    public void delete(Item item) {
        itemRepository.delete(item);
    }

    public void deleteById(Long id) {
        itemRepository.deleteById(id);
    }
}