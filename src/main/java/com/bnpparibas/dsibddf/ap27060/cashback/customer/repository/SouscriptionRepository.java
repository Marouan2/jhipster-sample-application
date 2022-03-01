package com.bnpparibas.dsibddf.ap27060.cashback.customer.repository;

import com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.Souscription;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Souscription entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SouscriptionRepository extends JpaRepository<Souscription, Long> {}
