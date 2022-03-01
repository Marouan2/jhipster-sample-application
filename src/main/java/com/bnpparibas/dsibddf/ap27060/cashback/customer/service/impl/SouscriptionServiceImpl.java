package com.bnpparibas.dsibddf.ap27060.cashback.customer.service.impl;

import com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.Souscription;
import com.bnpparibas.dsibddf.ap27060.cashback.customer.repository.SouscriptionRepository;
import com.bnpparibas.dsibddf.ap27060.cashback.customer.service.SouscriptionService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Souscription}.
 */
@Service
@Transactional
public class SouscriptionServiceImpl implements SouscriptionService {

    private final Logger log = LoggerFactory.getLogger(SouscriptionServiceImpl.class);

    private final SouscriptionRepository souscriptionRepository;

    public SouscriptionServiceImpl(SouscriptionRepository souscriptionRepository) {
        this.souscriptionRepository = souscriptionRepository;
    }

    @Override
    public Souscription save(Souscription souscription) {
        log.debug("Request to save Souscription : {}", souscription);
        return souscriptionRepository.save(souscription);
    }

    @Override
    public Optional<Souscription> partialUpdate(Souscription souscription) {
        log.debug("Request to partially update Souscription : {}", souscription);

        return souscriptionRepository
            .findById(souscription.getId())
            .map(existingSouscription -> {
                if (souscription.getStatus() != null) {
                    existingSouscription.setStatus(souscription.getStatus());
                }
                if (souscription.getCreatedDate() != null) {
                    existingSouscription.setCreatedDate(souscription.getCreatedDate());
                }
                if (souscription.getEndDate() != null) {
                    existingSouscription.setEndDate(souscription.getEndDate());
                }

                return existingSouscription;
            })
            .map(souscriptionRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Souscription> findAll() {
        log.debug("Request to get all Souscriptions");
        return souscriptionRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Souscription> findOne(Long id) {
        log.debug("Request to get Souscription : {}", id);
        return souscriptionRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Souscription : {}", id);
        souscriptionRepository.deleteById(id);
    }
}
