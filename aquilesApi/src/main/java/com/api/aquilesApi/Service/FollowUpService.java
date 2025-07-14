package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.FollowUpsEntity;
import com.api.aquilesApi.Repository.FollowUpRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class FollowUpService implements Idao<FollowUpsEntity, Long> {

    private final FollowUpRepository followUpRepository;

    public FollowUpService(FollowUpRepository followUpRepository) {
        this.followUpRepository = followUpRepository;
    }

    // Service Find All
    @Override
    public Page<FollowUpsEntity> findAll(PageRequest pageRequest) {
        return  followUpRepository. findAll(pageRequest);
    }

    // Service Find By ID
    @Override
    public FollowUpsEntity getById(Long id) {
        return followUpRepository.findById(id).orElseThrow(() ->
                new CustomException("FollowUp whit id " + id + "not fund", HttpStatus.NO_CONTENT));
    }

    // Service Create
    @Override
    public void create(FollowUpsEntity entity) {this.followUpRepository.save(entity);}

    // Service Update
    @Override
    public void update(FollowUpsEntity entity) { this.followUpRepository.save(entity);}

    // Service Save
    @Override
    public FollowUpsEntity save(FollowUpsEntity entity) {return followUpRepository.save(entity);}

    // Service Delete/Deactivate
    @Override
    public void delete(FollowUpsEntity entity) {this.followUpRepository.delete(entity);}
}
