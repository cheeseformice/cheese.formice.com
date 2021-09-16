import ar from "./ar";
import en from "./en";
import es from "./es";
import fr from "./fr";
import hu from "./hu";
import lv from "./lv";
import pl from "./pl";
import pt from "./pt";
import ro from "./ro";
import ru from "./ru";
import tr from "./tr";

// RTL support
interface Container {
  [key: string]: string | Container;
}

function addRLM(fields: Container) {
  // https://en.wikipedia.org/wiki/Right-to-left_mark
  for (const field in fields) {
    const value = fields[field];
    if (typeof value !== "string") {
      addRLM(value);
    } else {
      fields[field] += "\u200F";
    }
  }
}

const rtlLanguages = [ar];
for (let idx = 0; idx < rtlLanguages.length; idx++) {
  addRLM(rtlLanguages[idx] as Container);
}

export default {
  ar,
  en,
  es,
  fr,
  hu,
  lv,
  pl,
  pt,
  ro,
  ru,
  tr,
};
