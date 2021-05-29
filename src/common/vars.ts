let tmp: string;

switch (window.location.hostname) {
  case "cfmtest.tk":
  case "cheese.formice.com":
  case "beta.formice.com":
    tmp = window.location.hostname;
    break;

  default:
    tmp = "cfmtest.tk";
}

export const DOMAIN = tmp;
