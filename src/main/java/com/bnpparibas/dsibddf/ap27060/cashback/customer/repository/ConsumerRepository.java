package com.bnpparibas.dsibddf.ap27060.cashback.customer.repository;

import com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.Consumer;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Consumer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ConsumerRepository extends JpaRepository<Consumer, Long> {}
