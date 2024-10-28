package com.senacsf.aquiles.app.business;

import com.google.zxing.qrcode.decoder.Mode;
import com.senacsf.aquiles.app.dto.JustificationDto;
import com.senacsf.aquiles.app.entities.Excuses;
import com.senacsf.aquiles.app.entities.Justification;
import com.senacsf.aquiles.app.service.JustificationService;
import com.senacsf.aquiles.app.utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class JustificationBusiness {

    @Autowired
    private JustificationService justificationService;

    private final ModelMapper modelMapper = new ModelMapper();

    public List<JustificationDto> findAll(){
        try {
            List<Justification> justificationList = justificationService.findAll();
            if (justificationList.isEmpty()){
                return new ArrayList<>();
            }
            List<JustificationDto> justificationDtoList = new ArrayList<>();

            justificationList.forEach(justification -> justificationDtoList.add(modelMapper.map(justification, JustificationDto.class)));
            return justificationDtoList;
        } catch (Exception e ) {
            throw new CustomException("Error getting justifications");
        }
    }

    public void update(JustificationDto justificationDto) {
        try {
            Justification justification = modelMapper.map(justificationDto, Justification.class);
            justificationService.save(justification);
        } catch (Exception e) {
            throw new CustomException("Error saving justifications");
        }
    }

    public void create(JustificationDto justificationDto) {
        try {
            Justification justification = modelMapper.map(justificationDto, Justification.class);
            justificationService.save(justification);
        } catch (Exception e) {
            throw new CustomException("Error to saving");
        }
    }
    public void delete(Long justificationId) {
        try {
            Justification justification = justificationService.getById(justificationId);
            if (justification == null){
                throw new CustomException("Justification with id" + justificationId + "not found");
            }
            justificationService.delete(justification);
        } catch (Exception e) {
            System.err.println(e.getMessage());
        }
    }
}