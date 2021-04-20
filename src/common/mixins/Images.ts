import { Vue } from "vue-class-component";
import * as images from "../images";

class Images extends Vue {
  getBadge = images.getBadge;
  getInventory = images.getInventory;
  getImage = images.getImage;
  getLook = images.getLook;
  getAvatar = images.getAvatar;
}

export default Images;
