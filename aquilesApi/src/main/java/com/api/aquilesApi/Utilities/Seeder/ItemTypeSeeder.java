package com.api.aquilesApi.Utilities.Seeder;

import com.api.aquilesApi.Repository.ItemTypeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class ItemTypeSeeder implements CommandLineRunner {

    private final ItemTypeRepository itemTypeRepository;

    public ItemTypeSeeder(ItemTypeRepository itemTypeRepository) {
        this.itemTypeRepository = itemTypeRepository;
    }

    @Override
    public void run(String... args)  {
        createItemTypeIfNotExists("Actitudinal");
        createItemTypeIfNotExists("Académico");
    }

    private void createItemTypeIfNotExists(String name) {
        if (!itemTypeRepository.existsByName(name)) {
            var itemType = new com.api.aquilesApi.Entity.ItemType();
            itemType.setName(name);
            itemTypeRepository.save(itemType);
        }
    }
}
