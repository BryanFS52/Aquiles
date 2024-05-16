package com.senacsf.aquiles.app.service.dao;

import com.senacsf.aquiles.app.entities.Teams_scrum;

import java.util.List;

public interface Idao <T,ID> {
    public List<T> findAll();
    public T getById(ID id);
    public void update(T obje);
    public void save(T obje);
    public void delete(T obje);
    public void create(T obje);
}
