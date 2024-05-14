package com.senacsf.aquiles.app.service.dao;

import java.util.List;

public interface Idao <T,ID> {
    public List<T> findAll();
    public T getById(ID id);
    public  void save(T obje);
    public void delete(T obje);

}
