package com.bnpparibas.dsibddf.ap27060.cashback.customer.domain;

import com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.enumeration.StatusConcent;
import com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.enumeration.TypeConcent;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * not an ignored comment
 */
@Schema(description = "not an ignored comment")
@Entity
@Table(name = "concent")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Concent implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private TypeConcent type;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusConcent status;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @Column(name = "updated_date")
    private LocalDate updatedDate;

    @ManyToMany(mappedBy = "concents")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "concents" }, allowSetters = true)
    private Set<Compte> comptes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Concent id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TypeConcent getType() {
        return this.type;
    }

    public Concent type(TypeConcent type) {
        this.setType(type);
        return this;
    }

    public void setType(TypeConcent type) {
        this.type = type;
    }

    public StatusConcent getStatus() {
        return this.status;
    }

    public Concent status(StatusConcent status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(StatusConcent status) {
        this.status = status;
    }

    public LocalDate getCreatedDate() {
        return this.createdDate;
    }

    public Concent createdDate(LocalDate createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDate getUpdatedDate() {
        return this.updatedDate;
    }

    public Concent updatedDate(LocalDate updatedDate) {
        this.setUpdatedDate(updatedDate);
        return this;
    }

    public void setUpdatedDate(LocalDate updatedDate) {
        this.updatedDate = updatedDate;
    }

    public Set<Compte> getComptes() {
        return this.comptes;
    }

    public void setComptes(Set<Compte> comptes) {
        if (this.comptes != null) {
            this.comptes.forEach(i -> i.removeConcent(this));
        }
        if (comptes != null) {
            comptes.forEach(i -> i.addConcent(this));
        }
        this.comptes = comptes;
    }

    public Concent comptes(Set<Compte> comptes) {
        this.setComptes(comptes);
        return this;
    }

    public Concent addCompte(Compte compte) {
        this.comptes.add(compte);
        compte.getConcents().add(this);
        return this;
    }

    public Concent removeCompte(Compte compte) {
        this.comptes.remove(compte);
        compte.getConcents().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Concent)) {
            return false;
        }
        return id != null && id.equals(((Concent) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Concent{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", status='" + getStatus() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", updatedDate='" + getUpdatedDate() + "'" +
            "}";
    }
}
