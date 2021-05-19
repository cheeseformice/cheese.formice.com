<template>
  <template v-if="!tribe">
    <div class="text-center q-pt-xl">
      <q-spinner color="secondary" size="5rem" :thickness="3" />
    </div>
  </template>
  <template v-else>
    <c-hero
      :id="tribe.id"
      :tribe="true"
      :tabs="tabs"
      :title="tribe.name"
      img="https://cfmtest.tk/tfm/images/x_transformice/x_evt/x_evt_03/0or8meuj/map-mongolfiere.jpg"
    />
    <div class="container q-py-md">
      <router-view v-slot="{ Component }">
        <!-- <keep-alive> -->
        <component :is="Component" />
        <!-- </keep-alive> -->
      </router-view>
    </div>
  </template>
</template>

<script lang="ts">
import { Options, Prop, Watch, mixins } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

import { CHero } from "src/components";
import { TribeModule } from "src/store";
import { Images } from "src/common/mixins";
import useReactiveMeta from "./meta";
import { setup } from "vue-class-component";

@Options({ components: { CHero } })
export default class TribePage extends mixins(Images) {
  @Prop() tribeName!: string;

  meta = setup(function () {
    const { setTribe } = useReactiveMeta();
    return { setTribe };
  });

  get tribe() {
    const tribeModule = getModule(TribeModule, this.$store);
    return tribeModule?.tribe;
  }

  get tabs() {
    if (!this.tribe) return [];
    const tribeName = this.tribe.name;
    return [
      { label: this.$t("profile"), to: { name: "tribe", params: { tribeName } } },
      { label: this.$t("members"), to: { name: "tribeMembers", params: { tribeName } } },
      { label: this.$t("normal"), to: { name: "tribeNormal", params: { tribeName } } },
      { label: this.$t("racing"), to: { name: "tribeRacing", params: { tribeName } } },
      { label: this.$t("survivor"), to: { name: "tribeSurvivor", params: { tribeName } } },
      { label: this.$t("defilante"), to: { name: "tribeDefilante", params: { tribeName } } },
    ];
  }

  async mounted() {
    if (!this.tribe || this.tribeName.toUpperCase() !== this.tribe?.name.toUpperCase()) {
      await this.onTribeNameChange();
    }
    if (this.tribe) {
      this.meta.setTribe(this.tribe);
      const tribeModule = getModule(TribeModule, this.$store);
      await tribeModule.getChangelogs();
    }
  }

  @Watch("tribeName")
  async onTribeNameChange() {
    const tribeModule = getModule(TribeModule, this.$store);
    tribeModule.setTribe(null);
    await tribeModule.getTribe(this.tribeName);
    if (!this.tribe) return await this.$router.push({ name: "home" });
    else this.meta.setTribe(this.tribe);
  }

  /** SSR */
  async serverPrefetch() {
    const tribeModule = getModule(TribeModule, this.$store);
    await tribeModule.getTribe(this.tribeName);
    if (this.tribe) this.meta.setTribe(this.tribe);
  }
}
</script>
