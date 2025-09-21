package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.ItemBusiness;
import com.api.aquilesApi.Dto.ItemDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import java.util.Map;

@DgsComponent
public class ItemResolver {
    private final ItemBusiness itemBusiness;

    public ItemResolver(ItemBusiness itemBusiness) {
        this.itemBusiness = itemBusiness;
    }

    // FindAll Items (GraphQL)
    @DgsQuery
    public Map<String, Object> allItems(@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<ItemDto> itemsDtoPage = itemBusiness.findAll(page, size);
            return ResponseHttpApi.responseHttpFindAll(
                    itemsDtoPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query ok",
                    itemsDtoPage.getTotalPages(),
                    page,
                    (int) itemsDtoPage.getTotalElements()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving Items: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById Item (GraphQL)
    @DgsQuery
    public Map<String, Object> itemById(@InputArgument Long id) {
        try {
            ItemDto itemDto = itemBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    itemDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving Item: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Add a new Item (GraphQL)
    @DgsMutation
    public Map<String, Object> addItem(@InputArgument(name ="item") ItemDto itemDto) {
        try {
            ItemDto itemDto1 = itemBusiness.add(itemDto);
            return ResponseHttpApi.responseHttpAction(
                    itemDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Item created successfully"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error creating Item: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Update an existing Item (GraphQL)
    @DgsMutation
    public Map<String, Object> updateItem(@InputArgument Long id, @InputArgument(name = "item") ItemDto itemDto) {        try {
            itemBusiness.update(id, itemDto);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Item updated successfully"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating Item: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    @DgsMutation
    public Map<String, Object> deleteItem(@InputArgument Long id) {
        try {
            itemBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Item deleted successfully"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting Item: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}