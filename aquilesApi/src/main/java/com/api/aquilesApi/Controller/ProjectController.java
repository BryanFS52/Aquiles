package com.api.aquilesApi.Controller;

/*
@RestController
@RequestMapping("api/project")
public class ProjectController {

    @Autowired
    private ProjectBusiness projectBusiness;

    //End-Point Para Traer Todos Los Proyectos
    @GetMapping("/all")
    public ResponseEntity<Map<String , Object>> findAll (@RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int size){
        try {
            Page<ProjectDto> projectDtoPage = projectBusiness.findAll(page , size);
            if(!projectDtoPage.isEmpty()){
                return new ResponseEntity<>(ResponseHttpApi.responseHttpFindAll(
                        projectDtoPage.getContent(),
                        ResponseHttpApi.CODE_OK,
                        "Successfully Completed",
                        projectDtoPage.getSize(),
                        projectDtoPage.getTotalPages(),
                        (int) projectDtoPage.getTotalElements()),
                        HttpStatus.OK);
            }else {
                return new ResponseEntity<>(ResponseHttpApi.responseHttpFindAll(
                        null,
                        ResponseHttpApi.NO_CONTENT,
                        "No attendances found",
                        0,
                        0,
                        0),
                        HttpStatus.NO_CONTENT);
            }
        }  catch (Exception e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error retrieving Project: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    //End-Point Para Traer Por Id
    @GetMapping("/find/{id}")
    public ResponseEntity<Map<String , Object>> findById(@PathVariable Long id){
        try {
            ProjectDto projectDto = this.projectBusiness.findById(id);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpFindId(
                    projectDto,
                    ResponseHttpApi.CODE_OK,
                    "Successfully Completed"),
                    HttpStatus.OK);
        } catch (CustomException e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error getting Project By Id: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    //End-Point Para Crear Un Nuevo Proyecto
    @PostMapping("/create")
    public ResponseEntity<Map<String , Object>> add(@RequestBody Map<String , Object> json){
        try {
            projectBusiness.add(json);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpAction(
                    ResponseHttpApi.CODE_OK,
                    "Project added successfully"),
                    HttpStatus.CREATED);
        } catch (CustomException e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error adding Project: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //End-Point Para Actualizar Un Proyecto
    @PutMapping("/update")
    public ResponseEntity<Map<String , Object>> update(@PathVariable Long id , @RequestBody Map<String , Object> json){
        try {
            projectBusiness.update(id , json);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpAction(
                    ResponseHttpApi.CODE_OK, "Project updated successfully"), HttpStatus.OK);
        }catch (CustomException e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error updating Project: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    //End-Point Para Eliminar Un Project
    @DeleteMapping("/delete")
    public ResponseEntity<Map<String , Object>> delete (@PathVariable Long id){
        {
            try {
                projectBusiness.delete(id);
                return new ResponseEntity<>(ResponseHttpApi.responseHttpAction(
                        ResponseHttpApi.CODE_OK, "Project deleted successfully"),
                        HttpStatus.OK);
            } catch (CustomException e) {
                return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                        e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                        HttpStatus.BAD_REQUEST);
            } catch (Exception e) {
                return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                        "Error deleting Project: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
 */