package com.bnpparibas.dsibddf.ap27060.cashback.customer.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.bnpparibas.dsibddf.ap27060.cashback.customer.IntegrationTest;
import com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.Concent;
import com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.enumeration.StatusConcent;
import com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.enumeration.TypeConcent;
import com.bnpparibas.dsibddf.ap27060.cashback.customer.repository.ConcentRepository;
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
 * Integration tests for the {@link ConcentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ConcentResourceIT {

    private static final TypeConcent DEFAULT_TYPE = TypeConcent.CONCENT;
    private static final TypeConcent UPDATED_TYPE = TypeConcent.CONCENT;

    private static final StatusConcent DEFAULT_STATUS = StatusConcent.STATUS_CONCENT;
    private static final StatusConcent UPDATED_STATUS = StatusConcent.STATUS_CONCENT;

    private static final LocalDate DEFAULT_CREATED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_UPDATED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/concents";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ConcentRepository concentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restConcentMockMvc;

    private Concent concent;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Concent createEntity(EntityManager em) {
        Concent concent = new Concent()
            .type(DEFAULT_TYPE)
            .status(DEFAULT_STATUS)
            .createdDate(DEFAULT_CREATED_DATE)
            .updatedDate(DEFAULT_UPDATED_DATE);
        return concent;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Concent createUpdatedEntity(EntityManager em) {
        Concent concent = new Concent()
            .type(UPDATED_TYPE)
            .status(UPDATED_STATUS)
            .createdDate(UPDATED_CREATED_DATE)
            .updatedDate(UPDATED_UPDATED_DATE);
        return concent;
    }

    @BeforeEach
    public void initTest() {
        concent = createEntity(em);
    }

    @Test
    @Transactional
    void createConcent() throws Exception {
        int databaseSizeBeforeCreate = concentRepository.findAll().size();
        // Create the Concent
        restConcentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(concent)))
            .andExpect(status().isCreated());

        // Validate the Concent in the database
        List<Concent> concentList = concentRepository.findAll();
        assertThat(concentList).hasSize(databaseSizeBeforeCreate + 1);
        Concent testConcent = concentList.get(concentList.size() - 1);
        assertThat(testConcent.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testConcent.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testConcent.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testConcent.getUpdatedDate()).isEqualTo(DEFAULT_UPDATED_DATE);
    }

    @Test
    @Transactional
    void createConcentWithExistingId() throws Exception {
        // Create the Concent with an existing ID
        concent.setId(1L);

        int databaseSizeBeforeCreate = concentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restConcentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(concent)))
            .andExpect(status().isBadRequest());

        // Validate the Concent in the database
        List<Concent> concentList = concentRepository.findAll();
        assertThat(concentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllConcents() throws Exception {
        // Initialize the database
        concentRepository.saveAndFlush(concent);

        // Get all the concentList
        restConcentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(concent.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].updatedDate").value(hasItem(DEFAULT_UPDATED_DATE.toString())));
    }

    @Test
    @Transactional
    void getConcent() throws Exception {
        // Initialize the database
        concentRepository.saveAndFlush(concent);

        // Get the concent
        restConcentMockMvc
            .perform(get(ENTITY_API_URL_ID, concent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(concent.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.updatedDate").value(DEFAULT_UPDATED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingConcent() throws Exception {
        // Get the concent
        restConcentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewConcent() throws Exception {
        // Initialize the database
        concentRepository.saveAndFlush(concent);

        int databaseSizeBeforeUpdate = concentRepository.findAll().size();

        // Update the concent
        Concent updatedConcent = concentRepository.findById(concent.getId()).get();
        // Disconnect from session so that the updates on updatedConcent are not directly saved in db
        em.detach(updatedConcent);
        updatedConcent.type(UPDATED_TYPE).status(UPDATED_STATUS).createdDate(UPDATED_CREATED_DATE).updatedDate(UPDATED_UPDATED_DATE);

        restConcentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedConcent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedConcent))
            )
            .andExpect(status().isOk());

        // Validate the Concent in the database
        List<Concent> concentList = concentRepository.findAll();
        assertThat(concentList).hasSize(databaseSizeBeforeUpdate);
        Concent testConcent = concentList.get(concentList.size() - 1);
        assertThat(testConcent.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testConcent.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testConcent.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testConcent.getUpdatedDate()).isEqualTo(UPDATED_UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingConcent() throws Exception {
        int databaseSizeBeforeUpdate = concentRepository.findAll().size();
        concent.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConcentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, concent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(concent))
            )
            .andExpect(status().isBadRequest());

        // Validate the Concent in the database
        List<Concent> concentList = concentRepository.findAll();
        assertThat(concentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchConcent() throws Exception {
        int databaseSizeBeforeUpdate = concentRepository.findAll().size();
        concent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConcentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(concent))
            )
            .andExpect(status().isBadRequest());

        // Validate the Concent in the database
        List<Concent> concentList = concentRepository.findAll();
        assertThat(concentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamConcent() throws Exception {
        int databaseSizeBeforeUpdate = concentRepository.findAll().size();
        concent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConcentMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(concent)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Concent in the database
        List<Concent> concentList = concentRepository.findAll();
        assertThat(concentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateConcentWithPatch() throws Exception {
        // Initialize the database
        concentRepository.saveAndFlush(concent);

        int databaseSizeBeforeUpdate = concentRepository.findAll().size();

        // Update the concent using partial update
        Concent partialUpdatedConcent = new Concent();
        partialUpdatedConcent.setId(concent.getId());

        partialUpdatedConcent.createdDate(UPDATED_CREATED_DATE);

        restConcentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConcent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConcent))
            )
            .andExpect(status().isOk());

        // Validate the Concent in the database
        List<Concent> concentList = concentRepository.findAll();
        assertThat(concentList).hasSize(databaseSizeBeforeUpdate);
        Concent testConcent = concentList.get(concentList.size() - 1);
        assertThat(testConcent.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testConcent.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testConcent.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testConcent.getUpdatedDate()).isEqualTo(DEFAULT_UPDATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateConcentWithPatch() throws Exception {
        // Initialize the database
        concentRepository.saveAndFlush(concent);

        int databaseSizeBeforeUpdate = concentRepository.findAll().size();

        // Update the concent using partial update
        Concent partialUpdatedConcent = new Concent();
        partialUpdatedConcent.setId(concent.getId());

        partialUpdatedConcent.type(UPDATED_TYPE).status(UPDATED_STATUS).createdDate(UPDATED_CREATED_DATE).updatedDate(UPDATED_UPDATED_DATE);

        restConcentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConcent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConcent))
            )
            .andExpect(status().isOk());

        // Validate the Concent in the database
        List<Concent> concentList = concentRepository.findAll();
        assertThat(concentList).hasSize(databaseSizeBeforeUpdate);
        Concent testConcent = concentList.get(concentList.size() - 1);
        assertThat(testConcent.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testConcent.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testConcent.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testConcent.getUpdatedDate()).isEqualTo(UPDATED_UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingConcent() throws Exception {
        int databaseSizeBeforeUpdate = concentRepository.findAll().size();
        concent.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConcentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, concent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(concent))
            )
            .andExpect(status().isBadRequest());

        // Validate the Concent in the database
        List<Concent> concentList = concentRepository.findAll();
        assertThat(concentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchConcent() throws Exception {
        int databaseSizeBeforeUpdate = concentRepository.findAll().size();
        concent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConcentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(concent))
            )
            .andExpect(status().isBadRequest());

        // Validate the Concent in the database
        List<Concent> concentList = concentRepository.findAll();
        assertThat(concentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamConcent() throws Exception {
        int databaseSizeBeforeUpdate = concentRepository.findAll().size();
        concent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConcentMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(concent)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Concent in the database
        List<Concent> concentList = concentRepository.findAll();
        assertThat(concentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteConcent() throws Exception {
        // Initialize the database
        concentRepository.saveAndFlush(concent);

        int databaseSizeBeforeDelete = concentRepository.findAll().size();

        // Delete the concent
        restConcentMockMvc
            .perform(delete(ENTITY_API_URL_ID, concent.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Concent> concentList = concentRepository.findAll();
        assertThat(concentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
