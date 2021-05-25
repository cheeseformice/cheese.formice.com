let tmp: string;

switch (window.location.hostname) {
  case "cfmtest.tk":
  case "cheese.formice.com":
  case "beta.cheese.formice.com":
    tmp = window.location.hostname;

  default:
    tmp = "cfmtest.tk";
}

export const DOMAIN = tmp;
