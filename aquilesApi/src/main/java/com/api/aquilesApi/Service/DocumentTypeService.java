package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.DocumentType;
import com.api.aquilesApi.Repository.DocumentTypeRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class DocumentTypeService implements Idao<DocumentType, Long> {

    @Autowired
    private DocumentTypeRepository documentTypeRepository;

    @Override
    public DocumentType getById(Long id) {
        return documentTypeRepository.findById(id).orElseThrow(() ->
                new CustomException("Document Type with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Transactional
    @Override
    public DocumentType save(DocumentType obje) {
        return this.documentTypeRepository.save(obje);
    }

    @Transactional
    @Override
    public void create(DocumentType entity) {
        this.save(entity); // Llama a save para manejar la creación
    }

    @Transactional
    @Override
    public void delete(DocumentType obje) {
        this.documentTypeRepository.delete(obje);
    }

    @Override
    public Page<DocumentType> findAll(PageRequest pageRequest) {
        return documentTypeRepository.findAll(pageRequest);
    }

    public boolean existsName(String name) {
        return documentTypeRepository.existsByName(name);
    }

    public boolean existsAcronym(String acronym) {
        return documentTypeRepository.existsByAcronym(acronym);
    }

    @Override
    public void update(DocumentType entity) {
        this.save(entity); // Usa save para actualizar la entidad
    }
}
