package com.senacsf.aquiles.app.service.dao; // Declara el paquete al que pertenece esta interfaz

import java.util.List; // Importa la clase List de java.util para trabajar con listas

// Declara una interfaz genérica llamada Idao con dos tipos genéricos T y ID
public interface Idao<T, ID> {

    // Método para obtener o retornar una lista de todas las instancias de una entidad en la base de datos.
    List<T> findAll();

    // Método para obtener una instancia específica de la entidad basada en un identificador único.
    T getById(ID id);

    // Método para actualizar una instancia existente de la entidad en la base de datos.
    void update(T entity);

    // Método para guardar una instancia de la entidad en la base de datos, ya sea creando una nueva entrada o actualizando una existente, devuelve la entidad guardada
    T save(T entity);

    // Método para eliminar una instancia existente de la entidad de la base de datos.
    void delete(T entity);

    // Método para crear una nueva instancia de la entidad en la base de datos (puede ser redundante con save dependiendo del uso).
    void create(T entity);
}
