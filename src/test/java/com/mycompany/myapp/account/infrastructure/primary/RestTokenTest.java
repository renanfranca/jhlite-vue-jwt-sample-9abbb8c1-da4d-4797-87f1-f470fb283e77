package com.mycompany.myapp.account.infrastructure.primary;

import static com.mycompany.myapp.account.domain.TokensFixture.*;
import static org.assertj.core.api.Assertions.*;

import com.mycompany.myapp.JsonHelper;
import com.mycompany.myapp.UnitTest;
import org.junit.jupiter.api.Test;

@UnitTest
class RestTokenTest {

  @Test
  void shouldConvertFromDomain() {
    assertThat(JsonHelper.writeAsString(RestToken.from(token()))).isEqualTo(json());
  }

  private String json() {
    return "{\"id_token\":\"token\"}";
  }
}
