package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.Item;
import com.api.aquilesApi.Repository.ItemRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ItemService implements Idao<Item, Long> {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    // Get all Item paginated
    @Override
    public Page<Item> findAll(PageRequest pageRequest) { return itemRepository.findAll(pageRequest);}

    // Get Item by ID or throw exception if not found
    @Override
    public Item getById(Long id) {
        return itemRepository.findById(id).orElseThrow(() ->
                new CustomException("Team Scrum with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    // Update an existing Item
    @Override
    public void update(Item entity) {
        this.itemRepository.save(entity);
    }

    // Save an Item (create or update)
    @Override
    public Item save(Item entity) {
        return itemRepository.save(entity);
    }

    // Delete a Item
    @Override
    public void delete(Item entity) {
        this.itemRepository.delete(entity);
    }

    // Create a new Item
    @Override
    public void create(Item entity) {
        this.itemRepository.save(entity);
    }
}