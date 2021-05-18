import { reactive } from "vue";
import { useMeta } from "quasar";

import { Tribe } from "src/api";

export default function useReactiveMeta() {
  const tribe = reactive({
    id: 0,
    name: "",
  });

  function setTribe({ id, name }: Tribe) {
    tribe.id = id;
    tribe.name = name;
  }

  useMeta(() => {
    return {
      title: `${tribe.name} | Cheeseformice`,
      meta: {
        description: {
          property: "description",
          content: `${tribe.name} profile - Cheeseformice`,
        },
        ogTitle: {
          property: "og:title",
          content: `${tribe.name} - Cheeseformice`,
        },
        ogDescription: {
          property: "og:description",
          content: `${tribe.name} profile - Cheeseformice`,
        },
        ogImage: {
          property: "og:image",
          content: `https://logostribu.atelier801.com/${tribe.id % 10000}/${tribe.id}.jpg`,
        },
      },
    };
  });

  return {
    setTribe,
  };
}
