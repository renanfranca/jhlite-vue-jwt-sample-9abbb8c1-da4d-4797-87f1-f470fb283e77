type AccountActivated = boolean;
type AccountAuthorities = string[];
type AccountEmail = string;
type AccountFirstName = string | null;
type AccountLangKey = string;
type AccountLastName = string | null;
type AccountLogin = string;

export type Account = {
  activated: AccountActivated;
  authorities: AccountAuthorities;
  email: AccountEmail;
  firstName: AccountFirstName;
  langKey: AccountLangKey;
  lastName: AccountLastName;
  login: AccountLogin;
};
