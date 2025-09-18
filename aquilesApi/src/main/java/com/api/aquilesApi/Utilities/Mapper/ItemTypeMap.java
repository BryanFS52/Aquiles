package com.api.aquilesApi.Utilities.Mapper;

import com.api.aquilesApi.Dto.ItemTypeDto;
import com.api.aquilesApi.Entity.ItemType;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import java.util.List;

@Mapper(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ItemTypeMap {
    ItemTypeMap INSTANCE = Mappers.getMapper(ItemTypeMap.class);

    ItemTypeDto EntityToDTO(ItemType itemType);

    ItemType DTOToEntity(ItemTypeDto itemType);

    List<ItemTypeDto> EntityToDTOs(List<ItemType> itemTypes);

    void updateItemType(ItemTypeDto itemTypeDto, @MappingTarget ItemType itemType);

    default Page<ItemTypeDto> EntityToDTOs(Page<ItemType> itemTypes) {
        List<ItemTypeDto> dtos = EntityToDTOs(itemTypes.getContent());
        return new PageImpl<>(dtos, itemTypes.getPageable(), itemTypes.getTotalElements());
    }
}
