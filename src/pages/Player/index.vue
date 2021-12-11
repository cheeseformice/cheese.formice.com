<template>
  <q-dialog v-model="showSanctionDialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">Player sanction</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <span v-if="!!sanctionInfoError" class="text-negative">
          <q-icon name="warning" color="warning" size="1rem" />
          {{ sanctionInfoError }}<br />
        </span>
        <span v-else>
          TFM permaban: <b>{{ sanctionInformation?.tfm ? "yes" : "no" }}</b
          ><br />
          CFM sanction: <b>{{ sanctionInformation?.cfm ? "yes" : "no" }}</b
          ><br /><br />

          <span v-if="sanctionInformation?.cfm">
            Responsible moderator: <b>{{ sanctionInformation.disqInfo.moderator.name }}</b
            ><br />
            Reason:
            <pre style="white-space: pre-wrap">{{ sanctionInformation.disqInfo.reason }}</pre>
          </span>
        </span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          v-if="sanctionInformation?.cfm"
          outline
          no-caps
          :label="$t('sanction.cancel')"
          color="secondary"
        />
        <q-btn
          v-if="sanctionInformation?.cfm"
          outline
          no-caps
          :label="$t('sanction.edit')"
          color="secondary"
        />
        <q-btn
          v-if="!sanctionInformation?.cfm"
          outline
          no-caps
          :label="$t('sanction.apply')"
          color="secondary"
        />
        <q-btn outline no-caps :label="$t('close')" color="secondary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <template v-if="!player">
    <div class="text-center q-pt-xl">
      <q-spinner color="secondary" size="5rem" :thickness="3" />
    </div>
  </template>
  <template v-else>
    <c-hero
      :id="player.id"
      :tabs="tabs"
      :buttons="buttons"
      :title="player.name"
      :img="banner"
      :cfmRoles="player.cfmRoles"
      :tfmRoles="player.tfmRoles"
      :rank="module.rank"
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
import Auth from "src/auth";
import { AuthState } from "src/auth/interfaces";
import { SanctionInformation } from "src/api";

@Options({ components: { CHero } })
export default class PlayerPage extends mixins(Images) {
  @Prop() playerName!: string;

  hook = -1;
  showModTools = false;
  showSanctionDialog = false;
  sanctionInfoError = "";
  sanctionInformation: SanctionInformation | null = null;

  meta = setup(function () {
    const { setPlayer } = useReactiveMeta();
    return { setPlayer };
  });

  get banner() {
    return this.getImage("x_transformice/x_evt/x_evt_03/0or8meuj/map-mongolfiere.jpg");
  }

  get module() {
    return getModule(PlayerModule, this.$store);
  }

  get player() {
    return this.module.player;
  }

  get tabs() {
    if (!this.player) return [];
    const playerName = this.player.name;
    return [
      { label: this.$t("profile"), to: { name: "player", params: { playerName } } },
      { label: this.$t("mouse"), to: { name: "playerMouse", params: { playerName } } },
      { label: this.$t("shaman"), to: { name: "playerShaman", params: { playerName } } },
      { label: this.$t("racing"), to: { name: "playerRacing", params: { playerName } } },
      { label: this.$t("survivor"), to: { name: "playerSurvivor", params: { playerName } } },
      { label: this.$t("defilante"), to: { name: "playerDefilante", params: { playerName } } },
    ];
  }

  get buttons() {
    if (!this.player) return [];

    if (this.showModTools) {
      return [{ label: this.$t("sanction.btn"), click: this.showSanctionPanel.bind(this) }];
    }
    return [];
  }

  /*async*/ showSanctionPanel() {
    if (!this.player) return;
    if (!this.sanctionInformation) {
      // const result = await Auth.mod.getSanction(this.player.id);
      const result: SanctionInformation = {
        success: undefined,
        tfm: false,
        cfm: true,
        disqInfo: {
          moderator: {
            id: 51058033,
            name: "Tocutoeltuco#0000",
            cfmRoles: ["dev"],
            tfmRoles: ["module"],
          },
          reason:
            "test asdkasldjalk wkleniowjeqowiemndaopjepaowjeo pawjepoawjewdmnoawino iwdjioawdjaiowejioawprjiaworaiow",
        },
      };

      this.sanctionInfoError = "";
      this.sanctionInformation = null;
      if (!result) {
        this.sanctionInfoError = "Unknown error.";
      } else if (typeof result === "string") {
        this.sanctionInfoError = result;
      } else {
        this.sanctionInformation = result;
      }
    }

    this.showSanctionDialog = true;
  }

  mounted() {
    this.hook = Auth.hook(
      { player: { cfmRoles: ["mod", "admin", "dev"] } },
      {
        hook: () => {
          if (!this.player || this.playerName.toUpperCase() !== this.player?.name.toUpperCase()) {
            void this.onPlayerNameChange();
          }
        },
        match: (state: AuthState) => {
          if (!state.logged) {
            return;
          } // for the IDE

          this.showModTools = true;
        },
        mismatch: () => {
          this.showModTools = false;
        },
      },
      ["player.cfmRoles"]
    );
  }

  unmounted() {
    Auth.unhook(this.hook);
  }

  @Watch("playerName")
  async onPlayerNameChange() {
    this.module.setPlayer(null);
    this.module.setLanguage(this.$i18n.locale);
    this.showSanctionDialog = false;
    this.sanctionInfoError = "";
    this.sanctionInformation = null;

    await this.module.getPlayer(this.playerName);
    if (!this.player) return await this.$router.push({ name: "home" });

    this.meta.setPlayer(this.player);
    await this.module.getChangelogs();
  }

  /** SSR */
  async serverPrefetch() {
    this.module.setLanguage(this.$i18n.locale);
    await this.module.getPlayer(this.playerName);
    if (this.player) this.meta.setPlayer(this.player);
  }
}
</script>
