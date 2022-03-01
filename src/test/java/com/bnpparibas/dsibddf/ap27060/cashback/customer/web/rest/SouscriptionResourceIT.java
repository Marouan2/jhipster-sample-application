package com.bnpparibas.dsibddf.ap27060.cashback.customer.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.bnpparibas.dsibddf.ap27060.cashback.customer.IntegrationTest;
import com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.Souscription;
import com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.enumeration.StatusSouscription;
import com.bnpparibas.dsibddf.ap27060.cashback.customer.repository.SouscriptionRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SouscriptionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SouscriptionResourceIT {

    private static final StatusSouscription DEFAULT_STATUS = StatusSouscription.STATUS_SOUSCRIPTION;
    private static final StatusSouscription UPDATED_STATUS = StatusSouscription.STATUS_SOUSCRIPTION;

    private static final LocalDate DEFAULT_CREATED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/souscriptions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SouscriptionRepository souscriptionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSouscriptionMockMvc;

    private Souscription souscription;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Souscription createEntity(EntityManager em) {
        Souscription souscription = new Souscription().status(DEFAULT_STATUS).createdDate(DEFAULT_CREATED_DATE).endDate(DEFAULT_END_DATE);
        return souscription;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Souscription createUpdatedEntity(EntityManager em) {
        Souscription souscription = new Souscription().status(UPDATED_STATUS).createdDate(UPDATED_CREATED_DATE).endDate(UPDATED_END_DATE);
        return souscription;
    }

    @BeforeEach
    public void initTest() {
        souscription = createEntity(em);
    }

    @Test
    @Transactional
    void createSouscription() throws Exception {
        int databaseSizeBeforeCreate = souscriptionRepository.findAll().size();
        // Create the Souscription
        restSouscriptionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(souscription)))
            .andExpect(status().isCreated());

        // Validate the Souscription in the database
        List<Souscription> souscriptionList = souscriptionRepository.findAll();
        assertThat(souscriptionList).hasSize(databaseSizeBeforeCreate + 1);
        Souscription testSouscription = souscriptionList.get(souscriptionList.size() - 1);
        assertThat(testSouscription.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testSouscription.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testSouscription.getEndDate()).isEqualTo(DEFAULT_END_DATE);
    }

    @Test
    @Transactional
    void createSouscriptionWithExistingId() throws Exception {
        // Create the Souscription with an existing ID
        souscription.setId(1L);

        int databaseSizeBeforeCreate = souscriptionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSouscriptionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(souscription)))
            .andExpect(status().isBadRequest());

        // Validate the Souscription in the database
        List<Souscription> souscriptionList = souscriptionRepository.findAll();
        assertThat(souscriptionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSouscriptions() throws Exception {
        // Initialize the database
        souscriptionRepository.saveAndFlush(souscription);

        // Get all the souscriptionList
        restSouscriptionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(souscription.getId().intValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())));
    }

    @Test
    @Transactional
    void getSouscription() throws Exception {
        // Initialize the database
        souscriptionRepository.saveAndFlush(souscription);

        // Get the souscription
        restSouscriptionMockMvc
            .perform(get(ENTITY_API_URL_ID, souscription.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(souscription.getId().intValue()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingSouscription() throws Exception {
        // Get the souscription
        restSouscriptionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSouscription() throws Exception {
        // Initialize the database
        souscriptionRepository.saveAndFlush(souscription);

        int databaseSizeBeforeUpdate = souscriptionRepository.findAll().size();

        // Update the souscription
        Souscription updatedSouscription = souscriptionRepository.findById(souscription.getId()).get();
        // Disconnect from session so that the updates on updatedSouscription are not directly saved in db
        em.detach(updatedSouscription);
        updatedSouscription.status(UPDATED_STATUS).createdDate(UPDATED_CREATED_DATE).endDate(UPDATED_END_DATE);

        restSouscriptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSouscription.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSouscription))
            )
            .andExpect(status().isOk());

        // Validate the Souscription in the database
        List<Souscription> souscriptionList = souscriptionRepository.findAll();
        assertThat(souscriptionList).hasSize(databaseSizeBeforeUpdate);
        Souscription testSouscription = souscriptionList.get(souscriptionList.size() - 1);
        assertThat(testSouscription.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testSouscription.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testSouscription.getEndDate()).isEqualTo(UPDATED_END_DATE);
    }

    @Test
    @Transactional
    void putNonExistingSouscription() throws Exception {
        int databaseSizeBeforeUpdate = souscriptionRepository.findAll().size();
        souscription.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSouscriptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, souscription.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(souscription))
            )
            .andExpect(status().isBadRequest());

        // Validate the Souscription in the database
        List<Souscription> souscriptionList = souscriptionRepository.findAll();
        assertThat(souscriptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSouscription() throws Exception {
        int databaseSizeBeforeUpdate = souscriptionRepository.findAll().size();
        souscription.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSouscriptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(souscription))
            )
            .andExpect(status().isBadRequest());

        // Validate the Souscription in the database
        List<Souscription> souscriptionList = souscriptionRepository.findAll();
        assertThat(souscriptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSouscription() throws Exception {
        int databaseSizeBeforeUpdate = souscriptionRepository.findAll().size();
        souscription.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSouscriptionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(souscription)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Souscription in the database
        List<Souscription> souscriptionList = souscriptionRepository.findAll();
        assertThat(souscriptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSouscriptionWithPatch() throws Exception {
        // Initialize the database
        souscriptionRepository.saveAndFlush(souscription);

        int databaseSizeBeforeUpdate = souscriptionRepository.findAll().size();

        // Update the souscription using partial update
        Souscription partialUpdatedSouscription = new Souscription();
        partialUpdatedSouscription.setId(souscription.getId());

        partialUpdatedSouscription.status(UPDATED_STATUS);

        restSouscriptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSouscription.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSouscription))
            )
            .andExpect(status().isOk());

        // Validate the Souscription in the database
        List<Souscription> souscriptionList = souscriptionRepository.findAll();
        assertThat(souscriptionList).hasSize(databaseSizeBeforeUpdate);
        Souscription testSouscription = souscriptionList.get(souscriptionList.size() - 1);
        assertThat(testSouscription.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testSouscription.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testSouscription.getEndDate()).isEqualTo(DEFAULT_END_DATE);
    }

    @Test
    @Transactional
    void fullUpdateSouscriptionWithPatch() throws Exception {
        // Initialize the database
        souscriptionRepository.saveAndFlush(souscription);

        int databaseSizeBeforeUpdate = souscriptionRepository.findAll().size();

        // Update the souscription using partial update
        Souscription partialUpdatedSouscription = new Souscription();
        partialUpdatedSouscription.setId(souscription.getId());

        partialUpdatedSouscription.status(UPDATED_STATUS).createdDate(UPDATED_CREATED_DATE).endDate(UPDATED_END_DATE);

        restSouscriptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSouscription.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSouscription))
            )
            .andExpect(status().isOk());

        // Validate the Souscription in the database
        List<Souscription> souscriptionList = souscriptionRepository.findAll();
        assertThat(souscriptionList).hasSize(databaseSizeBeforeUpdate);
        Souscription testSouscription = souscriptionList.get(souscriptionList.size() - 1);
        assertThat(testSouscription.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testSouscription.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testSouscription.getEndDate()).isEqualTo(UPDATED_END_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingSouscription() throws Exception {
        int databaseSizeBeforeUpdate = souscriptionRepository.findAll().size();
        souscription.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSouscriptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, souscription.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(souscription))
            )
            .andExpect(status().isBadRequest());

        // Validate the Souscription in the database
        List<Souscription> souscriptionList = souscriptionRepository.findAll();
        assertThat(souscriptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSouscription() throws Exception {
        int databaseSizeBeforeUpdate = souscriptionRepository.findAll().size();
        souscription.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSouscriptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(souscription))
            )
            .andExpect(status().isBadRequest());

        // Validate the Souscription in the database
        List<Souscription> souscriptionList = souscriptionRepository.findAll();
        assertThat(souscriptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSouscription() throws Exception {
        int databaseSizeBeforeUpdate = souscriptionRepository.findAll().size();
        souscription.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSouscriptionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(souscription))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Souscription in the database
        List<Souscription> souscriptionList = souscriptionRepository.findAll();
        assertThat(souscriptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSouscription() throws Exception {
        // Initialize the database
        souscriptionRepository.saveAndFlush(souscription);

        int databaseSizeBeforeDelete = souscriptionRepository.findAll().size();

        // Delete the souscription
        restSouscriptionMockMvc
            .perform(delete(ENTITY_API_URL_ID, souscription.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Souscription> souscriptionList = souscriptionRepository.findAll();
        assertThat(souscriptionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
