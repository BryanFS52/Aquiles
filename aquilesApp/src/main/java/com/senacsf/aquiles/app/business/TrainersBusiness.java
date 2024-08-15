package com.senacsf.aquiles.app.business;
import com.senacsf.aquiles.app.dto.TrainersDto;
import com.senacsf.aquiles.app.entities.Trainers;
import com.senacsf.aquiles.app.repository.TrainersRepository;
import com.senacsf.aquiles.app.service.TrainersService;
import com.senacsf.aquiles.app.utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@Component
public class TrainersBusiness {
    @Autowired
    TrainersService trainersService;

    private final ModelMapper modelMapper = new ModelMapper(); // Instancia de ModelMapper para mapear objetos

    public List<TrainersDto> findAll(){
        try {
            List<Trainers> trainersList = trainersService.findAll();
            if (trainersList.isEmpty()){
                return new ArrayList<>();
            }
            List<TrainersDto> trainersDtoList = new ArrayList<>();
            trainersList.forEach(Trainers ->trainersDtoList.add(modelMapper.map(Trainers , TrainersDto.class)));
            return trainersDtoList;
        } catch (Exception e){
            throw new CustomException("Error getting Trainers");
        }
    }

    public TrainersDto getById(Long id){
        try {
            Trainers trainers = trainersService.getById(id);
            if (trainers == null){
                throw new CustomException("Trainers with id " + id + " not found ");
            }
            return modelMapper.map(trainers , TrainersDto.class);
        } catch (Exception e){
            throw new CustomException("Error Getting Trainer By Id");
        }
    }

    public void update(TrainersDto trainersDto){
        try {
            Trainers trainers = modelMapper.map(trainersDto , Trainers.class);
            trainersService.save(trainers);
        }catch (Exception e){
            throw new CustomException("Error Updating Trainer");
        }
    }

    public void save(TrainersDto trainersDto){
        try {
            Trainers trainers = modelMapper.map(trainersDto , Trainers.class);
            trainersService.save(trainers);
        } catch (Exception e){
            throw new CustomException("Error saving Trainer");
        }
    }

    public void create(TrainersDto trainersDto){
        try {
            BigInteger documentNumber = trainersDto.getDocument_number();
            Trainers existingTrainer = trainersService.findByDocument_Number(documentNumber);
            if ( existingTrainer != null){
                throw  new CustomException("The trainer with document number " + documentNumber + "Already Exists");
            }

            Trainers trainers = modelMapper.map(trainersDto , Trainers.class);
            trainersService.save(trainers);
        } catch (Exception e){
            throw new CustomException("Error creating Trainer: " + e.getMessage());
        }
    }

    public void delete(Long trainerId){
        try {
        Trainers trainers = trainersService.getById(trainerId);
            if (trainers == null){
                throw new CustomException("Trainer with id " + trainerId + " not found");
            }
            trainersService.delete(trainers);
        } catch (Exception e){
            System.err.println(e.getMessage()); // Imprimir el mensaje de error en la consola
        }
    }
}
