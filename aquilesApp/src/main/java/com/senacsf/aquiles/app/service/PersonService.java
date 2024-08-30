package com.senacsf.aquiles.app.service;


import com.senacsf.aquiles.app.entities.Person;
import com.senacsf.aquiles.app.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PersonService {
    private  final PersonRepository personRepository;

    @Autowired
    public PersonService (PersonRepository personRepository){
        this.personRepository = personRepository;
    }

    public Person savePerson(Person person){
        return  personRepository.save(person);
    }

    public List<Person> getAllPersons() {
        return personRepository.findAll();
    }

    public Optional<Person> getPersonById(Long id) {
        return personRepository.findById(id);
    }

    public void deletePerson(Long id) {
        personRepository.deleteById(id);
    }

}
