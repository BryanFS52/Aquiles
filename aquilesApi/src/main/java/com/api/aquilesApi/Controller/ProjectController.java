package com.api.aquilesApi.Controller;

import com.api.aquilesApi.Business.ProjectBusiness;
import com.api.aquilesApi.Dto.ProjectDto;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import org.springframework.data.domain.Page;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import java.util.Map;

@Controller
public class ProjectController {

    private final ProjectBusiness projectBusiness;
    public ProjectController(ProjectBusiness projectBusiness) {
        this.projectBusiness = projectBusiness;
    }

    //End-Point Para Traer Todos Los Proyectos (GraphQL)
    @QueryMapping
    public Map<String , Object> findAll (@Argument int page, @Argument int size){
        try {
            Page<ProjectDto> projectDtoPage = projectBusiness.findAll(page , size);
            if(!projectDtoPage.isEmpty()){
                return ResponseHttpApi.responseHttpFindAll(
                        projectDtoPage.getContent(),
                        ResponseHttpApi.CODE_OK,
                        "Successfully Completed",
                        projectDtoPage.getSize(),
                        projectDtoPage.getTotalPages(),
                        (int) projectDtoPage.getTotalElements());
            }else {
                return ResponseHttpApi.responseHttpFindAll(
                        null,
                        ResponseHttpApi.NO_CONTENT,
                        "No attendances found",
                        0,
                        0,
                        0);
            }
        }  catch (Exception e){
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving Project: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    //End-Point Para Traer Poroyecto por Id (GraphQL)
    @QueryMapping
    public Map<String , Object> findById(@Argument Long id){
        try {
            ProjectDto projectDto = this.projectBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    projectDto,
                    ResponseHttpApi.CODE_OK,
                    "Successfully Completed");
        } catch (CustomException e){
            return ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            return ResponseHttpApi.responseHttpError(
                    "Error getting Project By Id: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //End-Point Para Crear Un Nuevo Proyecto (GraphQL)
    @MutationMapping
    public Map<String , Object> add(@Argument ProjectDto projectDto){
        try {
            ProjectDto projectDto1 = projectBusiness.add(projectDto);
            return ResponseHttpApi.responseHttpAction(
                    projectDto1.getProjectId(),
                    ResponseHttpApi.CODE_OK,
                    "Project added successfully");
        } catch (Exception e){
            return ResponseHttpApi.responseHttpError(
                    "Error adding Project: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //End-Point Para Actualizar Un Proyecto (GraphQL)
    @MutationMapping
    public Map<String , Object> update(@Argument Long id , @Argument ("input") ProjectDto projectDto){
        try {
            projectBusiness.update(id , projectDto);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update successfully"
            );
        } catch (Exception e){
            return ResponseHttpApi.responseHttpError(
                    "Error updating Project: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    };


    //End-Point Para Eliminar Un Project (GraphQL)
    @MutationMapping
    public Map<String , Object> delete (@Argument Long id){
        {
            try {
                projectBusiness.delete(id);
                return ResponseHttpApi.responseHttpAction(
                        id,
                        ResponseHttpApi.CODE_OK,
                        "Delete successfully"
                );
            } catch (Exception e) {
                return ResponseHttpApi.responseHttpError(
                        "Error deleting Project: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}