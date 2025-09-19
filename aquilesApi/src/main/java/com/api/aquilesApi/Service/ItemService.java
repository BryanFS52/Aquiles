package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.Item;
import com.api.aquilesApi.Repository.ItemRepository;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
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