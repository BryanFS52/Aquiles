package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.FollowUpAction;
import com.api.aquilesApi.Repository.FollowUpActionRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class FollowUpService implements Idao<FollowUpAction, Long> {

    private final FollowUpActionRepository followUpRepository;

    public FollowUpService(FollowUpActionRepository followUpRepository) {
        this.followUpRepository = followUpRepository;
    }

    // Service Find All
    @Override
    public Page<FollowUpAction> findAll(PageRequest pageRequest) {
        return  followUpRepository.findAll(pageRequest);
    }

    // Service Find By ID
    @Override
    public FollowUpAction getById(Long id) {
        return followUpRepository.findById(id).orElseThrow(() ->
                new CustomException("FollowUp whit id " + id + "not fund", HttpStatus.NO_CONTENT));
    }

    // Service Create
    @Override
    public void create(FollowUpAction entity) {this.followUpRepository.save(entity);}

    // Service Update
    @Override
    public void update(FollowUpAction entity) { this.followUpRepository.save(entity);}

    // Service Save
    @Override
    public FollowUpAction save(FollowUpAction entity) {return followUpRepository.save(entity);}

    // Service Delete/Deactivate
    @Override
    public void delete(FollowUpAction entity) {this.followUpRepository.delete(entity);}
}
