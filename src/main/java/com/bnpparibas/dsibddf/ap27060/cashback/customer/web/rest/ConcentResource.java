package com.bnpparibas.dsibddf.ap27060.cashback.customer.web.rest;

import com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.Concent;
import com.bnpparibas.dsibddf.ap27060.cashback.customer.repository.ConcentRepository;
import com.bnpparibas.dsibddf.ap27060.cashback.customer.service.ConcentService;
import com.bnpparibas.dsibddf.ap27060.cashback.customer.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.Concent}.
 */
@RestController
@RequestMapping("/api")
public class ConcentResource {

    private final Logger log = LoggerFactory.getLogger(ConcentResource.class);

    private static final String ENTITY_NAME = "jhipsterSampleApplicationConcent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ConcentService concentService;

    private final ConcentRepository concentRepository;

    public ConcentResource(ConcentService concentService, ConcentRepository concentRepository) {
        this.concentService = concentService;
        this.concentRepository = concentRepository;
    }

    /**
     * {@code POST  /concents} : Create a new concent.
     *
     * @param concent the concent to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new concent, or with status {@code 400 (Bad Request)} if the concent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/concents")
    public ResponseEntity<Concent> createConcent(@RequestBody Concent concent) throws URISyntaxException {
        log.debug("REST request to save Concent : {}", concent);
        if (concent.getId() != null) {
            throw new BadRequestAlertException("A new concent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Concent result = concentService.save(concent);
        return ResponseEntity
            .created(new URI("/api/concents/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /concents/:id} : Updates an existing concent.
     *
     * @param id the id of the concent to save.
     * @param concent the concent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated concent,
     * or with status {@code 400 (Bad Request)} if the concent is not valid,
     * or with status {@code 500 (Internal Server Error)} if the concent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/concents/{id}")
    public ResponseEntity<Concent> updateConcent(@PathVariable(value = "id", required = false) final Long id, @RequestBody Concent concent)
        throws URISyntaxException {
        log.debug("REST request to update Concent : {}, {}", id, concent);
        if (concent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, concent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!concentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Concent result = concentService.save(concent);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, concent.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /concents/:id} : Partial updates given fields of an existing concent, field will ignore if it is null
     *
     * @param id the id of the concent to save.
     * @param concent the concent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated concent,
     * or with status {@code 400 (Bad Request)} if the concent is not valid,
     * or with status {@code 404 (Not Found)} if the concent is not found,
     * or with status {@code 500 (Internal Server Error)} if the concent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/concents/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Concent> partialUpdateConcent(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Concent concent
    ) throws URISyntaxException {
        log.debug("REST request to partial update Concent partially : {}, {}", id, concent);
        if (concent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, concent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!concentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Concent> result = concentService.partialUpdate(concent);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, concent.getId().toString())
        );
    }

    /**
     * {@code GET  /concents} : get all the concents.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of concents in body.
     */
    @GetMapping("/concents")
    public List<Concent> getAllConcents() {
        log.debug("REST request to get all Concents");
        return concentService.findAll();
    }

    /**
     * {@code GET  /concents/:id} : get the "id" concent.
     *
     * @param id the id of the concent to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the concent, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/concents/{id}")
    public ResponseEntity<Concent> getConcent(@PathVariable Long id) {
        log.debug("REST request to get Concent : {}", id);
        Optional<Concent> concent = concentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(concent);
    }

    /**
     * {@code DELETE  /concents/:id} : delete the "id" concent.
     *
     * @param id the id of the concent to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/concents/{id}")
    public ResponseEntity<Void> deleteConcent(@PathVariable Long id) {
        log.debug("REST request to delete Concent : {}", id);
        concentService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
