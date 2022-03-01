package com.bnpparibas.dsibddf.ap27060.cashback.customer.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.bnpparibas.dsibddf.ap27060.cashback.customer.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SouscriptionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Souscription.class);
        Souscription souscription1 = new Souscription();
        souscription1.setId(1L);
        Souscription souscription2 = new Souscription();
        souscription2.setId(souscription1.getId());
        assertThat(souscription1).isEqualTo(souscription2);
        souscription2.setId(2L);
        assertThat(souscription1).isNotEqualTo(souscription2);
        souscription1.setId(null);
        assertThat(souscription1).isNotEqualTo(souscription2);
    }
}
