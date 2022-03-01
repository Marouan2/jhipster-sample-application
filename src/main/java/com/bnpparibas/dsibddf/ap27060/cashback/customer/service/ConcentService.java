package com.bnpparibas.dsibddf.ap27060.cashback.customer.service;

import com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.Concent;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Concent}.
 */
public interface ConcentService {
    /**
     * Save a concent.
     *
     * @param concent the entity to save.
     * @return the persisted entity.
     */
    Concent save(Concent concent);

    /**
     * Partially updates a concent.
     *
     * @param concent the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Concent> partialUpdate(Concent concent);

    /**
     * Get all the concents.
     *
     * @return the list of entities.
     */
    List<Concent> findAll();

    /**
     * Get the "id" concent.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Concent> findOne(Long id);

    /**
     * Delete the "id" concent.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
