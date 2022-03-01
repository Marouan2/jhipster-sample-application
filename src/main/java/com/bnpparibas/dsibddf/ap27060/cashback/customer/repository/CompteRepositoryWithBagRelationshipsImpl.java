package com.bnpparibas.dsibddf.ap27060.cashback.customer.repository;

import com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.Compte;
import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import org.hibernate.annotations.QueryHints;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class CompteRepositoryWithBagRelationshipsImpl implements CompteRepositoryWithBagRelationships {

    @Autowired
    private EntityManager entityManager;

    @Override
    public Optional<Compte> fetchBagRelationships(Optional<Compte> compte) {
        return compte.map(this::fetchConcents);
    }

    @Override
    public Page<Compte> fetchBagRelationships(Page<Compte> comptes) {
        return new PageImpl<>(fetchBagRelationships(comptes.getContent()), comptes.getPageable(), comptes.getTotalElements());
    }

    @Override
    public List<Compte> fetchBagRelationships(List<Compte> comptes) {
        return Optional.of(comptes).map(this::fetchConcents).get();
    }

    Compte fetchConcents(Compte result) {
        return entityManager
            .createQuery("select compte from Compte compte left join fetch compte.concents where compte is :compte", Compte.class)
            .setParameter("compte", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Compte> fetchConcents(List<Compte> comptes) {
        return entityManager
            .createQuery("select distinct compte from Compte compte left join fetch compte.concents where compte in :comptes", Compte.class)
            .setParameter("comptes", comptes)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
    }
}
