package com.bnpparibas.dsibddf.ap27060.cashback.customer.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.bnpparibas.dsibddf.ap27060.cashback.customer.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ConcentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Concent.class);
        Concent concent1 = new Concent();
        concent1.setId(1L);
        Concent concent2 = new Concent();
        concent2.setId(concent1.getId());
        assertThat(concent1).isEqualTo(concent2);
        concent2.setId(2L);
        assertThat(concent1).isNotEqualTo(concent2);
        concent1.setId(null);
        assertThat(concent1).isNotEqualTo(concent2);
    }
}
