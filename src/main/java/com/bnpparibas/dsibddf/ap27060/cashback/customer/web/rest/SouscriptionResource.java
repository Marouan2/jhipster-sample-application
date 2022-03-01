package com.bnpparibas.dsibddf.ap27060.cashback.customer.web.rest;

import com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.Souscription;
import com.bnpparibas.dsibddf.ap27060.cashback.customer.repository.SouscriptionRepository;
import com.bnpparibas.dsibddf.ap27060.cashback.customer.service.SouscriptionService;
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
 * REST controller for managing {@link com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.Souscription}.
 */
@RestController
@RequestMapping("/api")
public class SouscriptionResource {

    private final Logger log = LoggerFactory.getLogger(SouscriptionResource.class);

    private static final String ENTITY_NAME = "jhipsterSampleApplicationSouscription";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SouscriptionService souscriptionService;

    private final SouscriptionRepository souscriptionRepository;

    public SouscriptionResource(SouscriptionService souscriptionService, SouscriptionRepository souscriptionRepository) {
        this.souscriptionService = souscriptionService;
        this.souscriptionRepository = souscriptionRepository;
    }

    /**
     * {@code POST  /souscriptions} : Create a new souscription.
     *
     * @param souscription the souscription to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new souscription, or with status {@code 400 (Bad Request)} if the souscription has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/souscriptions")
    public ResponseEntity<Souscription> createSouscription(@RequestBody Souscription souscription) throws URISyntaxException {
        log.debug("REST request to save Souscription : {}", souscription);
        if (souscription.getId() != null) {
            throw new BadRequestAlertException("A new souscription cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Souscription result = souscriptionService.save(souscription);
        return ResponseEntity
            .created(new URI("/api/souscriptions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /souscriptions/:id} : Updates an existing souscription.
     *
     * @param id the id of the souscription to save.
     * @param souscription the souscription to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated souscription,
     * or with status {@code 400 (Bad Request)} if the souscription is not valid,
     * or with status {@code 500 (Internal Server Error)} if the souscription couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/souscriptions/{id}")
    public ResponseEntity<Souscription> updateSouscription(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Souscription souscription
    ) throws URISyntaxException {
        log.debug("REST request to update Souscription : {}, {}", id, souscription);
        if (souscription.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, souscription.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!souscriptionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Souscription result = souscriptionService.save(souscription);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, souscription.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /souscriptions/:id} : Partial updates given fields of an existing souscription, field will ignore if it is null
     *
     * @param id the id of the souscription to save.
     * @param souscription the souscription to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated souscription,
     * or with status {@code 400 (Bad Request)} if the souscription is not valid,
     * or with status {@code 404 (Not Found)} if the souscription is not found,
     * or with status {@code 500 (Internal Server Error)} if the souscription couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/souscriptions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Souscription> partialUpdateSouscription(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Souscription souscription
    ) throws URISyntaxException {
        log.debug("REST request to partial update Souscription partially : {}, {}", id, souscription);
        if (souscription.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, souscription.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!souscriptionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Souscription> result = souscriptionService.partialUpdate(souscription);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, souscription.getId().toString())
        );
    }

    /**
     * {@code GET  /souscriptions} : get all the souscriptions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of souscriptions in body.
     */
    @GetMapping("/souscriptions")
    public List<Souscription> getAllSouscriptions() {
        log.debug("REST request to get all Souscriptions");
        return souscriptionService.findAll();
    }

    /**
     * {@code GET  /souscriptions/:id} : get the "id" souscription.
     *
     * @param id the id of the souscription to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the souscription, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/souscriptions/{id}")
    public ResponseEntity<Souscription> getSouscription(@PathVariable Long id) {
        log.debug("REST request to get Souscription : {}", id);
        Optional<Souscription> souscription = souscriptionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(souscription);
    }

    /**
     * {@code DELETE  /souscriptions/:id} : delete the "id" souscription.
     *
     * @param id the id of the souscription to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/souscriptions/{id}")
    public ResponseEntity<Void> deleteSouscription(@PathVariable Long id) {
        log.debug("REST request to delete Souscription : {}", id);
        souscriptionService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
