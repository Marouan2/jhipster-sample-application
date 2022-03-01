package com.bnpparibas.dsibddf.ap27060.cashback.customer.domain;

import com.bnpparibas.dsibddf.ap27060.cashback.customer.domain.enumeration.Brand;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Consumer.
 */
@Entity
@Table(name = "consumer")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Consumer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "ikpi")
    private String ikpi;

    @Enumerated(EnumType.STRING)
    @Column(name = "brand")
    private Brand brand;

    @Column(name = "scope")
    private String scope;

    @Column(name = "alias")
    private String alias;

    @Column(name = "telematicld")
    private String telematicld;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @Column(name = "updated_date")
    private LocalDate updatedDate;

    @ManyToOne
    @JsonIgnoreProperties(value = { "concent" }, allowSetters = true)
    private Souscription souscription;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Consumer id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIkpi() {
        return this.ikpi;
    }

    public Consumer ikpi(String ikpi) {
        this.setIkpi(ikpi);
        return this;
    }

    public void setIkpi(String ikpi) {
        this.ikpi = ikpi;
    }

    public Brand getBrand() {
        return this.brand;
    }

    public Consumer brand(Brand brand) {
        this.setBrand(brand);
        return this;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public String getScope() {
        return this.scope;
    }

    public Consumer scope(String scope) {
        this.setScope(scope);
        return this;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public String getAlias() {
        return this.alias;
    }

    public Consumer alias(String alias) {
        this.setAlias(alias);
        return this;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public String getTelematicld() {
        return this.telematicld;
    }

    public Consumer telematicld(String telematicld) {
        this.setTelematicld(telematicld);
        return this;
    }

    public void setTelematicld(String telematicld) {
        this.telematicld = telematicld;
    }

    public LocalDate getCreatedDate() {
        return this.createdDate;
    }

    public Consumer createdDate(LocalDate createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDate getUpdatedDate() {
        return this.updatedDate;
    }

    public Consumer updatedDate(LocalDate updatedDate) {
        this.setUpdatedDate(updatedDate);
        return this;
    }

    public void setUpdatedDate(LocalDate updatedDate) {
        this.updatedDate = updatedDate;
    }

    public Souscription getSouscription() {
        return this.souscription;
    }

    public void setSouscription(Souscription souscription) {
        this.souscription = souscription;
    }

    public Consumer souscription(Souscription souscription) {
        this.setSouscription(souscription);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Consumer)) {
            return false;
        }
        return id != null && id.equals(((Consumer) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Consumer{" +
            "id=" + getId() +
            ", ikpi='" + getIkpi() + "'" +
            ", brand='" + getBrand() + "'" +
            ", scope='" + getScope() + "'" +
            ", alias='" + getAlias() + "'" +
            ", telematicld='" + getTelematicld() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", updatedDate='" + getUpdatedDate() + "'" +
            "}";
    }
}
