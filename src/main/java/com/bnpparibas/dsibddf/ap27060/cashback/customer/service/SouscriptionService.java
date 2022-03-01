package com.bnpparibas.dsibddf.ap27060.cashback.customer.service;

import com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.Souscription;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Souscription}.
 */
public interface SouscriptionService {
    /**
     * Save a souscription.
     *
     * @param souscription the entity to save.
     * @return the persisted entity.
     */
    Souscription save(Souscription souscription);

    /**
     * Partially updates a souscription.
     *
     * @param souscription the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Souscription> partialUpdate(Souscription souscription);

    /**
     * Get all the souscriptions.
     *
     * @return the list of entities.
     */
    List<Souscription> findAll();

    /**
     * Get the "id" souscription.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Souscription> findOne(Long id);

    /**
     * Delete the "id" souscription.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
