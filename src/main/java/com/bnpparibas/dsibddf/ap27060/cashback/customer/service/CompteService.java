package com.bnpparibas.dsibddf.ap27060.cashback.customer.service;

import com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.Compte;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Compte}.
 */
public interface CompteService {
    /**
     * Save a compte.
     *
     * @param compte the entity to save.
     * @return the persisted entity.
     */
    Compte save(Compte compte);

    /**
     * Partially updates a compte.
     *
     * @param compte the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Compte> partialUpdate(Compte compte);

    /**
     * Get all the comptes.
     *
     * @return the list of entities.
     */
    List<Compte> findAll();

    /**
     * Get all the comptes with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Compte> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" compte.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Compte> findOne(Long id);

    /**
     * Delete the "id" compte.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
