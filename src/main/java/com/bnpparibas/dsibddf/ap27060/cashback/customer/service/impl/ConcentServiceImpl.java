package com.bnpparibas.dsibddf.ap27060.cashback.customer.service.impl;

import com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.Concent;
import com.bnpparibas.dsibddf.ap27060.cashback.customer.repository.ConcentRepository;
import com.bnpparibas.dsibddf.ap27060.cashback.customer.service.ConcentService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Concent}.
 */
@Service
@Transactional
public class ConcentServiceImpl implements ConcentService {

    private final Logger log = LoggerFactory.getLogger(ConcentServiceImpl.class);

    private final ConcentRepository concentRepository;

    public ConcentServiceImpl(ConcentRepository concentRepository) {
        this.concentRepository = concentRepository;
    }

    @Override
    public Concent save(Concent concent) {
        log.debug("Request to save Concent : {}", concent);
        return concentRepository.save(concent);
    }

    @Override
    public Optional<Concent> partialUpdate(Concent concent) {
        log.debug("Request to partially update Concent : {}", concent);

        return concentRepository
            .findById(concent.getId())
            .map(existingConcent -> {
                if (concent.getType() != null) {
                    existingConcent.setType(concent.getType());
                }
                if (concent.getStatus() != null) {
                    existingConcent.setStatus(concent.getStatus());
                }
                if (concent.getCreatedDate() != null) {
                    existingConcent.setCreatedDate(concent.getCreatedDate());
                }
                if (concent.getUpdatedDate() != null) {
                    existingConcent.setUpdatedDate(concent.getUpdatedDate());
                }

                return existingConcent;
            })
            .map(concentRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Concent> findAll() {
        log.debug("Request to get all Concents");
        return concentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Concent> findOne(Long id) {
        log.debug("Request to get Concent : {}", id);
        return concentRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Concent : {}", id);
        concentRepository.deleteById(id);
    }
}
