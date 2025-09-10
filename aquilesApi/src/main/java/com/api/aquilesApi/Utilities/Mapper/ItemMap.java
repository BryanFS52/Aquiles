package com.api.aquilesApi.Utilities.Mapper;

import com.api.aquilesApi.Dto.ItemDto;
import com.api.aquilesApi.Entity.Item;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import java.util.List;

@Mapper(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ItemMap {
    ItemMap INSTANCE = Mappers.getMapper(ItemMap.class);

    ItemDto EntityToDTO(Item item);

    Item DTOToEntity(ItemDto item);

    List<ItemDto> EntityToDTOs(List<Item> items);

    void updateItem(ItemDto itemDto, @MappingTarget Item item);

    default Page<ItemDto> EntityToDTOs(Page<Item> items) {
        List<ItemDto> dtos = EntityToDTOs(items.getContent());
        return new PageImpl<>(dtos, items.getPageable(), items.getTotalElements());
    }
}
