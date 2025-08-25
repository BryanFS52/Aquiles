package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.ImprovementPlanDeliveryBusiness;
import com.api.aquilesApi.Dto.ImprovementPlanDeliveryDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import java.util.Map;

@DgsComponent
public class ImprovementPlanDeliveryResolver {

    private final ImprovementPlanDeliveryBusiness deliveryBusiness;

    public ImprovementPlanDeliveryResolver(ImprovementPlanDeliveryBusiness deliveryBusiness) {
        this.deliveryBusiness = deliveryBusiness;
    }

    // FindAll ImprovementPlanDelivery (GraphQL)
    @DgsQuery
    public Map<String, Object> allImprovementPlanDeliveries(@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<ImprovementPlanDeliveryDto> deliveryPage = deliveryBusiness.findAll(page, size);
            return ResponseHttpApi.responseHttpFindAll(
                    deliveryPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query ok",
                    deliveryPage.getTotalPages(),
                    page,
                    (int) deliveryPage.getTotalElements()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving improvementPlanDeliveries: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById ImprovementPlanDelivery (GraphQL)
    @DgsQuery
    public Map<String, Object> improvementPlanDeliveryById(@InputArgument Long id) {
        try {
            ImprovementPlanDeliveryDto deliveryDto = deliveryBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    deliveryDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving improvementPlanDelivery: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Add a new ImprovementPlanDelivery (GraphQL)
    @DgsMutation
    public Map<String, Object> addImprovementPlanDelivery(@InputArgument(name = "input") ImprovementPlanDeliveryDto deliveryDto) {
        try {
            ImprovementPlanDeliveryDto savedDto = deliveryBusiness.add(deliveryDto);
            return ResponseHttpApi.responseHttpAction(
                    savedDto.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding improvementPlanDelivery: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Update ImprovementPlanDelivery (GraphQL)
    @DgsMutation
    public Map<String, Object> updateImprovementPlanDelivery(@InputArgument Long id, @InputArgument(name = "input") ImprovementPlanDeliveryDto deliveryDto) {
        try {
            deliveryBusiness.update(id, deliveryDto);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating improvementPlanDelivery: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Delete ImprovementPlanDelivery
    @DgsMutation
    public Map<String, Object> deleteImprovementPlanDelivery(@InputArgument Long id) {
        try {
            deliveryBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting improvementPlanDelivery: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}