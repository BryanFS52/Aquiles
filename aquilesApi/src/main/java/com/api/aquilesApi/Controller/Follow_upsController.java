package com.api.aquilesApi.Controller;

/*
@Controller
public class Follow_upsController {
    private final Follow_upsBusiness followUpsBusiness;

    public Follow_upsController(Follow_upsBusiness followUpsBusiness) {
        this.followUpsBusiness = followUpsBusiness;
    }

    //End-Point Para Traer Todos Los Follow Ups
    @QueryMapping
    public Map<String , Object> findAll(@Argument int page, @Argument int size){
        try {
            Page<Follow_upsDto> followUpsDtoPage = followUpsBusiness.findAll(page, size);
            if (!followUpsDtoPage.isEmpty()){
                return ResponseHttpApi.responseHttpFindAll(
                        followUpsDtoPage.getContent(),
                        ResponseHttpApi.CODE_OK,
                        "Successfully Completed",
                        followUpsDtoPage.getSize(),
                        followUpsDtoPage.getTotalPages(),
                        (int) followUpsDtoPage.getTotalElements()),
                        HttpStatus.OK);
                );
            } else {
                return ResponseHttpApi.responseHttpFindAll(
                        null,
                        ResponseHttpApi.NO_CONTENT,
                        "No Follow Up found",
                        0,
                        0,
                        0),
                        HttpStatus.NO_CONTENT);
                );
            }
        } catch (Exception e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error retrieving Follow Ups: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // End-Point Para Traer Por Id
    @GetMapping("/find/{id}")
    public ResponseEntity<Map<String , Object>> findById(@PathVariable Long id){
        try {
            Follow_upsDto followUpsDto = this.followUpsBusiness.findById(id);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpFindId(
                    followUpsDto,
                    ResponseHttpApi.CODE_OK,
                    "Successfully Completed"),
                    HttpStatus.OK);
        } catch (CustomException e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error getting Follow Up By Id: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // End-Point Crear Un Nuevo Follow Up
    @PostMapping("/create")
    public ResponseEntity<Map<String , Object>> add(@RequestBody Map<String ,Object> json){
        try {
            followUpsBusiness.add(json);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpAction(
                    ResponseHttpApi.CODE_OK,
                    "Follow Up added successfully"),
                    HttpStatus.CREATED);
        }catch (CustomException e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error adding Follow Up: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // End-Point Para Actualizar Un Follow Up
    @PutMapping("/update")
    public ResponseEntity<Map<String ,Object>> update(@PathVariable Long id ,  @RequestBody Map<String , Object> json ){
        try {
            followUpsBusiness.update(id, json);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpAction(
                    ResponseHttpApi.CODE_OK, "Trainer updated successfully"), HttpStatus.OK);
        } catch (CustomException e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e){
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error updating Follow Up: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // End-Point Para Eliminar Un Follow Up
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String , Object>> delete (@PathVariable Long id){
        try {
            followUpsBusiness.delete(id);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpAction(
                    ResponseHttpApi.CODE_OK, "Follow Up deleted successfully"),
                    HttpStatus.OK);
        } catch (CustomException e) {
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error deleting attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
 */