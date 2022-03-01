package com.bnpparibas.dsibddf.ap27060.cashback.customer.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Compte.
 */
@Entity
@Table(name = "compte")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Compte implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "id_pfm")
    private String idPFM;

    @Column(name = "alias")
    private String alias;

    @Column(name = "rib")
    private String rib;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @ManyToMany
    @JoinTable(
        name = "rel_compte__concent",
        joinColumns = @JoinColumn(name = "compte_id"),
        inverseJoinColumns = @JoinColumn(name = "concent_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "comptes" }, allowSetters = true)
    private Set<Concent> concents = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Compte id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIdPFM() {
        return this.idPFM;
    }

    public Compte idPFM(String idPFM) {
        this.setIdPFM(idPFM);
        return this;
    }

    public void setIdPFM(String idPFM) {
        this.idPFM = idPFM;
    }

    public String getAlias() {
        return this.alias;
    }

    public Compte alias(String alias) {
        this.setAlias(alias);
        return this;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public String getRib() {
        return this.rib;
    }

    public Compte rib(String rib) {
        this.setRib(rib);
        return this;
    }

    public void setRib(String rib) {
        this.rib = rib;
    }

    public LocalDate getCreatedDate() {
        return this.createdDate;
    }

    public Compte createdDate(LocalDate createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public Set<Concent> getConcents() {
        return this.concents;
    }

    public void setConcents(Set<Concent> concents) {
        this.concents = concents;
    }

    public Compte concents(Set<Concent> concents) {
        this.setConcents(concents);
        return this;
    }

    public Compte addConcent(Concent concent) {
        this.concents.add(concent);
        concent.getComptes().add(this);
        return this;
    }

    public Compte removeConcent(Concent concent) {
        this.concents.remove(concent);
        concent.getComptes().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Compte)) {
            return false;
        }
        return id != null && id.equals(((Compte) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Compte{" +
            "id=" + getId() +
            ", idPFM='" + getIdPFM() + "'" +
            ", alias='" + getAlias() + "'" +
            ", rib='" + getRib() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
