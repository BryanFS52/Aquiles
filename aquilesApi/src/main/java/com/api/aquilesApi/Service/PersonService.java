package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.Person;
import com.api.aquilesApi.Repository.PersonRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class PersonService implements Idao<Person, Long> {

    @Autowired
    private PersonRepository personRepository;

    @Override
    public Person getById(Long id) {
        return personRepository.findById(id).orElseThrow(() ->
                new CustomException("Person with id " + id + " not found", HttpStatus.NO_CONTENT)
        );
    }

    @Transactional
    @Override
    public Person save(Person person) {
        return this.personRepository.save(person);
    }

    @Transactional
    @Override
    public void create(Person person) {
        this.save(person); // Usa save para manejar la creación
    }

    @Transactional
    @Override
    public void update(Person person) {
        this.save(person); // Usa save para manejar la actualización
    }

    @Transactional
    @Override
    public void delete(Person person) {
        this.personRepository.delete(person);
    }

    @Override
    public Page<Person> findAll(PageRequest pageRequest) {
        return personRepository.findAll(pageRequest);
    }

    public boolean existsByDocument(Long document) {
        return personRepository.existsByDocument(document);  // Verificar si el documento existe
    }

    public boolean existsByEmail(String email) {
        return personRepository.existsByEmail(email);  // Verificar si el correo electrónico existe
    }
}
