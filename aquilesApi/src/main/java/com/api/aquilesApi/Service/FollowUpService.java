package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.FollowUps;
import com.api.aquilesApi.Repository.FollowUpRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class FollowUpService implements Idao<FollowUps, Long> {

    private final FollowUpRepository followUpRepository;

    public FollowUpService(FollowUpRepository followUpRepository) {
        this.followUpRepository = followUpRepository;
    }

    // Service Find All
    @Override
    public Page<FollowUps> findAll(PageRequest pageRequest) {
        return  followUpRepository. findAll(pageRequest);
    }

    // Service Find By ID
    @Override
    public FollowUps getById(Long id) {
        return followUpRepository.findById(id).orElseThrow(() ->
                new CustomException("FollowUp whit id " + id + "not fund", HttpStatus.NO_CONTENT));
    }

    // Service Create
    @Override
    public void create(FollowUps entity) {this.followUpRepository.save(entity);}

    // Service Update
    @Override
    public void update(FollowUps entity) { this.followUpRepository.save(entity);}

    // Service Save
    @Override
    public FollowUps save(FollowUps entity) {return followUpRepository.save(entity);}

    // Service Delete/Deactivate
    @Override
    public void delete(FollowUps entity) {this.followUpRepository.delete(entity);}
}
