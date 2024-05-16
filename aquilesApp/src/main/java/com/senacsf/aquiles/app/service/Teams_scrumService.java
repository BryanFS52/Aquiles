package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.entities.Teams_scrum;
import com.senacsf.aquiles.app.repository.Teams_scrumRepository;
import com.senacsf.aquiles.app.service.dao.Idao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class Teams_scrumService implements Idao<Teams_scrum, Long> {

    @Autowired
    Teams_scrumRepository teamsScrumRepository;


    @Override
    public List<Teams_scrum> findAll() {
        return List.of();
    }

    @Override
    public Teams_scrum getById(Long aLong) {
            return null;
    }

    @Override
    public void update(Teams_scrum obje) {
        this.teamsScrumRepository.save(obje);
    }

    @Override
    public void create(Teams_scrum obje) {
        this.teamsScrumRepository.save(obje);

    }

    @Override
    public void delete(Teams_scrum obje) {
        this.teamsScrumRepository.delete(obje);
    }
}
