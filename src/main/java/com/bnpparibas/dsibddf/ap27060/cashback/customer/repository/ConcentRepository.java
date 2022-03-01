package com.bnpparibas.dsibddf.ap27060.cashback.customer.repository;

import com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.Concent;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Concent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ConcentRepository extends JpaRepository<Concent, Long> {}
