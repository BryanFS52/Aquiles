package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.ItemTypeBusiness;
import com.api.aquilesApi.Dto.ItemTypeDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import java.util.Map;

@DgsComponent
public class ItemTypeResolver {

    private final ItemTypeBusiness itemTypeBusiness;

    public ItemTypeResolver(ItemTypeBusiness itemTypeBusiness) {
        this.itemTypeBusiness = itemTypeBusiness;
    }

    // FindAll ItemTypes (GraphQL)
    @DgsQuery
    public Map<String, Object> allItemTypes(@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<ItemTypeDto> itemTypeDtoPage = itemTypeBusiness.findAll(page, size);
            return ResponseHttpApi.responseHttpFindAll(
                    itemTypeDtoPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query ok",
                    itemTypeDtoPage.getTotalPages(),
                    page,
                    (int) itemTypeDtoPage.getTotalElements()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving ItemTypes: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById ItemType (GraphQL)
    @DgsQuery
    public Map<String, Object> itemTypeById(@InputArgument Long id) {
        try {
            ItemTypeDto itemTypeDto1 = itemTypeBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    itemTypeDto1,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving ItemType: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Add a new ItemType (GraphQL)
    @DgsMutation
    public Map<String, Object> addItemType(@InputArgument(name = "input") ItemTypeDto itemTypeDto) {
        try {
            ItemTypeDto ItemTypeDto1 = itemTypeBusiness.add(itemTypeDto);
            return ResponseHttpApi.responseHttpAction(
                    ItemTypeDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Item Type created successfully"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error creating Item Type: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // update an existing ItemType (GraphQL)
    @DgsMutation
    public Map<String, Object> updateItemType(@InputArgument Long id, @InputArgument(name = "input") ItemTypeDto itemTypeDto) {
        try {
            itemTypeBusiness.update(id, itemTypeDto);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Item Type updated successfully"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating Item Type: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Delete an ItemType (GraphQL)
    @DgsMutation
    public Map<String, Object> deleteItemType(@InputArgument Long id) {
        try {
            itemTypeBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Item Type deleted successfully"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting Item Type: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
