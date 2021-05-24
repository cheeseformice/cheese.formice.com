<template>
  <template v-if="!player">
    <div class="text-center q-pt-xl">
      <q-spinner color="secondary" size="5rem" :thickness="3" />
    </div>
  </template>
  <template v-else>
    <c-hero
      :id="player.id"
      :tabs="tabs"
      :title="player.name"
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
import { PlayerModule } from "src/store";
import { Images } from "src/common/mixins";
import useReactiveMeta from "./meta";
import { setup } from "vue-class-component";

@Options({ components: { CHero } })
export default class PlayerPage extends mixins(Images) {
  @Prop() playerName!: string;

  meta = setup(function () {
    const { setPlayer } = useReactiveMeta();
    return { setPlayer };
  });

  get player() {
    const playerModule = getModule(PlayerModule, this.$store);
    return playerModule.player;
  }

  get tabs() {
    if (!this.player) return [];
    const playerName = this.player.name;
    return [
      { label: this.$t("profile"), to: { name: "player", params: { playerName } } },
      { label: this.$t("normal"), to: { name: "playerNormal", params: { playerName } } },
      { label: this.$t("shaman"), to: { name: "playerShaman", params: { playerName } } },
      { label: this.$t("racing"), to: { name: "playerRacing", params: { playerName } } },
      { label: this.$t("survivor"), to: { name: "playerSurvivor", params: { playerName } } },
      { label: this.$t("defilante"), to: { name: "playerDefilante", params: { playerName } } },
    ];
  }

  async mounted() {
    const playerModule = getModule(PlayerModule, this.$store);
    if (!this.player || this.playerName.toUpperCase() !== this.player?.name.toUpperCase()) {
      await this.onPlayerNameChange();
    }
    if (this.player) {
      this.meta.setPlayer(this.player);
      await playerModule.getChangelogs();
    }
  }

  @Watch("playerName")
  async onPlayerNameChange() {
    const playerModule = getModule(PlayerModule, this.$store);
    playerModule.setPlayer(null);
    playerModule.setLanguage(this.$i18n.locale);
    await playerModule.getPlayer(this.playerName);
    if (!this.player) return await this.$router.push({ name: "home" });
    else this.meta.setPlayer(this.player);
  }

  /** SSR */
  async serverPrefetch() {
    const playerModule = getModule(PlayerModule, this.$store);
    playerModule.setLanguage(this.$i18n.locale);
    await playerModule.getPlayer(this.playerName);
    if (this.player) this.meta.setPlayer(this.player);
  }
}
</script>
