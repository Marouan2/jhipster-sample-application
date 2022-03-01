package com.bnpparibas.dsibddf.ap27060.cashback.customer.repository;

import com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.Compte;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface CompteRepositoryWithBagRelationships {
    Optional<Compte> fetchBagRelationships(Optional<Compte> compte);

    List<Compte> fetchBagRelationships(List<Compte> comptes);

    Page<Compte> fetchBagRelationships(Page<Compte> comptes);
}
