package com.mycompany.myapp.account.infrastructure.primary;

import com.mycompany.myapp.shared.authentication.application.AuthenticatedUser;
import com.mycompany.myapp.shared.authentication.domain.Role;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
class AccountResource {

  /**
   * {@code GET  /account} : get the current user.
   *
   * @return the current user.
   * @throws AccountResourceException
   *           {@code 500 (Internal Server Error)} if the user couldn't be returned.
   */
  @GetMapping("/account")
  public RestAccount getAccount() {
    return new RestAccount(AuthenticatedUser.username().get(), roles());
  }

  private Set<String> roles() {
    return AuthenticatedUser.roles().stream().map(Role::key).collect(Collectors.toUnmodifiableSet());
  }
}
