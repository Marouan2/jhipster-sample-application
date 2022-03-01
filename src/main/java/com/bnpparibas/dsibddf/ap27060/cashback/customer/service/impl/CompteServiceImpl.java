package com.bnpparibas.dsibddf.ap27060.cashback.customer.service.impl;

import com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.Compte;
import com.bnpparibas.dsibddf.ap27060.cashback.customer.repository.CompteRepository;
import com.bnpparibas.dsibddf.ap27060.cashback.customer.service.CompteService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Compte}.
 */
@Service
@Transactional
public class CompteServiceImpl implements CompteService {

    private final Logger log = LoggerFactory.getLogger(CompteServiceImpl.class);

    private final CompteRepository compteRepository;

    public CompteServiceImpl(CompteRepository compteRepository) {
        this.compteRepository = compteRepository;
    }

    @Override
    public Compte save(Compte compte) {
        log.debug("Request to save Compte : {}", compte);
        return compteRepository.save(compte);
    }

    @Override
    public Optional<Compte> partialUpdate(Compte compte) {
        log.debug("Request to partially update Compte : {}", compte);

        return compteRepository
            .findById(compte.getId())
            .map(existingCompte -> {
                if (compte.getIdPFM() != null) {
                    existingCompte.setIdPFM(compte.getIdPFM());
                }
                if (compte.getAlias() != null) {
                    existingCompte.setAlias(compte.getAlias());
                }
                if (compte.getRib() != null) {
                    existingCompte.setRib(compte.getRib());
                }
                if (compte.getCreatedDate() != null) {
                    existingCompte.setCreatedDate(compte.getCreatedDate());
                }

                return existingCompte;
            })
            .map(compteRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Compte> findAll() {
        log.debug("Request to get all Comptes");
        return compteRepository.findAllWithEagerRelationships();
    }

    public Page<Compte> findAllWithEagerRelationships(Pageable pageable) {
        return compteRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Compte> findOne(Long id) {
        log.debug("Request to get Compte : {}", id);
        return compteRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Compte : {}", id);
        compteRepository.deleteById(id);
    }
}
