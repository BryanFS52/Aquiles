package com.api.aquilesApi.Utilities.Mapper;

import com.api.aquilesApi.Dto.ItemDto;
import com.api.aquilesApi.Entity.Item;
import com.api.aquilesApi.Entity.ItemType;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import java.util.List;

@Mapper(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ItemMap {
    ItemMap INSTANCE = Mappers.getMapper(ItemMap.class);

    @Mapping(target = "itemTypeId", source = "itemType.id")
    ItemDto EntityToDTO(Item item);

    @Mapping(target = "itemType", expression = "java(mapItemType(itemDto.getItemTypeId()))")
    @Mapping(target = "checklist", ignore = true)
    Item DTOToEntity(ItemDto itemDto);

    List<ItemDto> EntityToDTOs(List<Item> items);

    @Mapping(target = "itemType", expression = "java(mapItemType(itemDto.getItemTypeId()))")
    @Mapping(target = "checklist", ignore = true)
    void updateItem(ItemDto itemDto, @MappingTarget Item item);

    default Page<ItemDto> EntityToDTOs(Page<Item> items) {
        List<ItemDto> dtos = EntityToDTOs(items.getContent());
        return new PageImpl<>(dtos, items.getPageable(), items.getTotalElements());
    }

    default ItemType mapItemType(Long itemTypeId) {
        if (itemTypeId == null) {
            return null;
        }
        ItemType itemType = new ItemType();
        itemType.setId(itemTypeId);
        return itemType;
    }
}
