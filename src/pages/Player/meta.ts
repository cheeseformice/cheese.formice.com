import { reactive } from "vue";
import { useMeta } from "quasar";

import { Player } from "src/api";
import { DOMAIN } from "src/common/vars";

export default function useReactiveMeta() {
  const player = reactive({
    name: "",
    look: "",
  });

  function setPlayer({ name, shop }: Player) {
    player.name = name;
    player.look = shop.look;
  }

  useMeta(() => {
    return {
      title: `${player.name} | Cheeseformice`,
      meta: {
        description: {
          property: "description",
          content: `${player.name} profile - Cheeseformice`,
        },
        ogTitle: {
          property: "og:title",
          content: `${player.name} - Cheeseformice`,
        },
        ogDescription: {
          property: "og:description",
          content: `${player.name} profile - Cheeseformice`,
        },
        ogImage: {
          property: "og:image",
          content: `https://${DOMAIN}/api/dressroom/mouse/${player.look}`,
        },
      },
    };
  });

  return {
    setPlayer,
  };
}
