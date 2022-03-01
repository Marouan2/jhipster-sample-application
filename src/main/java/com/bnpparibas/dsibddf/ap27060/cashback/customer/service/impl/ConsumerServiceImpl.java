package com.bnpparibas.dsibddf.ap27060.cashback.customer.service.impl;

import com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.Consumer;
import com.bnpparibas.dsibddf.ap27060.cashback.customer.repository.ConsumerRepository;
import com.bnpparibas.dsibddf.ap27060.cashback.customer.service.ConsumerService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Consumer}.
 */
@Service
@Transactional
public class ConsumerServiceImpl implements ConsumerService {

    private final Logger log = LoggerFactory.getLogger(ConsumerServiceImpl.class);

    private final ConsumerRepository consumerRepository;

    public ConsumerServiceImpl(ConsumerRepository consumerRepository) {
        this.consumerRepository = consumerRepository;
    }

    @Override
    public Consumer save(Consumer consumer) {
        log.debug("Request to save Consumer : {}", consumer);
        return consumerRepository.save(consumer);
    }

    @Override
    public Optional<Consumer> partialUpdate(Consumer consumer) {
        log.debug("Request to partially update Consumer : {}", consumer);

        return consumerRepository
            .findById(consumer.getId())
            .map(existingConsumer -> {
                if (consumer.getIkpi() != null) {
                    existingConsumer.setIkpi(consumer.getIkpi());
                }
                if (consumer.getBrand() != null) {
                    existingConsumer.setBrand(consumer.getBrand());
                }
                if (consumer.getScope() != null) {
                    existingConsumer.setScope(consumer.getScope());
                }
                if (consumer.getAlias() != null) {
                    existingConsumer.setAlias(consumer.getAlias());
                }
                if (consumer.getTelematicld() != null) {
                    existingConsumer.setTelematicld(consumer.getTelematicld());
                }
                if (consumer.getCreatedDate() != null) {
                    existingConsumer.setCreatedDate(consumer.getCreatedDate());
                }
                if (consumer.getUpdatedDate() != null) {
                    existingConsumer.setUpdatedDate(consumer.getUpdatedDate());
                }

                return existingConsumer;
            })
            .map(consumerRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Consumer> findAll() {
        log.debug("Request to get all Consumers");
        return consumerRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Consumer> findOne(Long id) {
        log.debug("Request to get Consumer : {}", id);
        return consumerRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Consumer : {}", id);
        consumerRepository.deleteById(id);
    }
}
