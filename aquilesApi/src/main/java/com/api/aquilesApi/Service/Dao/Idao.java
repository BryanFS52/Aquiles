package com.api.aquilesApi.Service.Dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface Idao<T, ID> {
    // Method to get or return a list of all instances of an entity in the database.
    // To get a list of all entities with pagination
    Page<T> findAll(PageRequest pageable);

    // Method to get a specific instance of the entity based on a unique identifier.
    T getById(ID id);

    // Method to update an existing instance of the entity in the database.
    void update(T entity);

    // Method to save an instance of the entity in the database, either by creating a new entry or updating an existing one, returns the saved entity.
    T save(T entity);

    // Method to delete an existing instance of the entity from the database.
    void delete(T entity);

    // Method to create a new instance of the entity in the database (maybe redundant with save depending on usage).
    void create(T entity);
}

