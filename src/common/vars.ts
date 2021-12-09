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

export const decimal = (x: number): string => {
  const slices: string[] = [];
  do {
    slices.unshift((x % 1000).toString(10));
    x = Math.floor(x / 1000);
  } while (x > 0);

  for (let index = 1; index < slices.length; index++) {
    const padded = "00" + slices[index];
    slices[index] = padded.substr(-3);
  }

  return slices.join(",");
};
