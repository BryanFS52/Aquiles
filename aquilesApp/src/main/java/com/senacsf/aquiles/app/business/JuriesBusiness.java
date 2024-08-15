package com.senacsf.aquiles.app.business;

import com.senacsf.aquiles.app.dto.JuriesDto;
import com.senacsf.aquiles.app.entities.Juries;
import com.senacsf.aquiles.app.service.JuriesService;
import com.senacsf.aquiles.app.utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class JuriesBusiness {

    @Autowired
    private JuriesService juriesService;

    private final ModelMapper modelMapper = new ModelMapper(); // Instancia de ModelMapper para mapear objetos

    public List<JuriesDto> findAll(){
        try {
            List<Juries> juriesList = juriesService.findAll();
            if (juriesList.isEmpty()){
                return new ArrayList<>();
            }
            List<JuriesDto> juriesDtoList = new ArrayList<>();
            juriesList.forEach(Juries -> juriesDtoList.add(modelMapper.map(Juries , JuriesDto.class)));
            return juriesDtoList;
        } catch (Exception e){
            throw new CustomException("Error getting Juries");
        }
    }

    public JuriesDto getById (Long id){
        try {
            Juries juries = juriesService.getById(id);
            if (juries == null){
                throw new CustomException("Jury with id " + id + " not found");
            }
            return modelMapper.map(juries , JuriesDto.class);
        } catch (Exception e){
            throw new CustomException("Error getting Jury By Id");
        }
    }

    public void update(JuriesDto juriesDto){
        try {
            Juries juries = modelMapper.map(juriesDto , Juries.class);
            juriesService.save(juries);
        }catch (Exception e){
            throw new CustomException("Error Updating Jury");
        }
    }

    public void save( JuriesDto juriesDto){
        try {
            Juries juries = modelMapper.map(juriesDto , Juries.class);
            juriesService.save(juries);
        } catch (Exception e ){
            throw  new CustomException("Erro Saving Jury");
        }
    }

    public void create( JuriesDto juriesDto){
        try {
            Long juryId = juriesDto.getJuryId();
            Juries existingJury = juriesService.findByJuryId(juryId);
            if (existingJury != null){
                throw new CustomException("The Jury With Id " + juryId + " Already Exists.");
            }
            Juries juries = modelMapper.map(juriesDto , Juries.class);
            juriesService.save(juries);
        } catch (Exception e){
            throw new CustomException("Error Creating Jury");
        }
    }

    public void delete(Long juryId){
        try {
            Juries juries = juriesService.getById(juryId);
            if (juries == null){
                throw new CustomException("Jury with id " + juryId + " not found");
            }
        } catch (Exception e){
            System.err.println(e.getMessage()); // Imprimir el mensaje de error en la consola
        }
    }




}
