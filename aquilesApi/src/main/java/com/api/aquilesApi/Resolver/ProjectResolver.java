package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.ProjectBusiness;
import com.api.aquilesApi.Dto.ProjectDto;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.DataConvert;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import java.util.Map;

@DgsComponent
public class ProjectResolver {

    private final ProjectBusiness projectBusiness;
    private final DataConvert dataConvert = new DataConvert();
    public ProjectResolver(ProjectBusiness projectBusiness) {
        this.projectBusiness = projectBusiness;
    }

    // FindAll Projects (GraphQL)
    @DgsQuery
    public Map<String , Object> allProjects(@InputArgument Integer page, @InputArgument Integer size){
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

    // FindById Projects (GraphQL)
    @DgsQuery
    public Map<String , Object> projectById(@InputArgument String id){
        try {
            Long idLong = dataConvert.parseLongOrNull(id);
            ProjectDto projectDto = this.projectBusiness.findById(idLong);
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

    // Add a New Project (GraphQL)
    @DgsMutation
    public Map<String , Object> addProject(@InputArgument(name = "input") ProjectDto projectDto){
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

    // Update Project (GraphQL)
    @DgsMutation
    public Map<String , Object> updateProject(@InputArgument String id , @InputArgument (name = "input") ProjectDto projectDto){
        try {
            Long idLong = dataConvert.parseLongOrNull(id);
            projectBusiness.update(idLong , projectDto);
            return ResponseHttpApi.responseHttpAction(
                    idLong,
                    ResponseHttpApi.CODE_OK,
                    "Update successfully"
            );
        } catch (Exception e){
            return ResponseHttpApi.responseHttpError(
                    "Error updating Project: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete Project (GraphQL)
    @DgsMutation
    public Map<String, Object> deleteProject(@InputArgument String id) {
        try {
            Long idLong = dataConvert.parseLongOrNull(id);
            projectBusiness.delete(idLong);
            return ResponseHttpApi.responseHttpAction(
                    idLong,
                    ResponseHttpApi.CODE_OK,
                    "Delete successfully"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting Project: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}