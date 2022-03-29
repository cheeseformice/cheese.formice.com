<template>
  <q-dialog v-model="showSanctionDialog">
    <q-card class="bg-contrast full-width">
      <q-card-section>
        <div class="text-h6">Player sanction</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <span v-if="!!sanctionInfoError" class="text-negative">
          <q-icon name="warning" color="warning" size="1rem" />
          {{ sanctionInfoError }}<br />
        </span>
        <span v-for="notice in notices" :key="notice.id" :class="`text-${notice.color}`">
          <q-icon name="warning" color="warning" size="1rem" />
          {{ notice.text }}<br />
        </span>
        <span v-if="!sanctionInfoError">
          TFM permaban: <b>{{ sanctionInformation?.tfm ? "yes" : "no" }}</b>
          <br />
          CFM sanction: <b>{{ sanctionInformation?.cfm ? "yes" : "no" }}</b>
          <br />
          <br />

          <span v-if="sanctionInformation?.cfm">
            Responsible moderator: <b>{{ sanctionInformation.disqInfo.moderator.name }}</b
            ><br />
            Reason:
            <pre style="white-space: pre-wrap">{{ sanctionInformation.disqInfo.reason }}</pre>
          </span>

          <q-input
            v-if="editing"
            outlined
            dense
            :dark="$dark.enabled"
            type="textarea"
            placeholder="Reason"
            v-model="newReason"
          />
        </span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          v-if="!sanctionInfoError && sanctionInformation?.cfm"
          outline
          no-caps
          :label="$t('sanction.cancel')"
          color="secondary"
          @click="cancelSanction"
        />
        <q-btn
          v-if="!sanctionInfoError && !editing"
          outline
          no-caps
          :label="$t('sanction.edit')"
          color="secondary"
          @click="editSanction"
        />
        <q-btn
          v-if="!sanctionInfoError && editing"
          outline
          no-caps
          :label="$t('sanction.apply')"
          color="secondary"
          @click="applySanction"
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

    <!-- Ranking type selector -->
    <q-menu
      v-if="$q.screen.gt.xs && rank.canQualify && !rank.disqualified"
      target="#player-rank-lb-type-lg"
      class="bg-contrast"
    >
      <leaderboard-selector :callback="selectLeaderboard" />
    </q-menu>
    <!-- Couldn't find a better way to make the menu re-attach on screen size change
          other than duplicating the menu. -->
    <q-menu
      v-if="!$q.screen.gt.xs && rank.canQualify && !rank.disqualified"
      target="#player-rank-lb-type-sm"
      class="bg-contrast"
    >
      <leaderboard-selector :callback="selectLeaderboard" />
    </q-menu>
  </template>
</template>

<script lang="ts">
import { Options, Prop, Watch, mixins } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

import { CHero } from "src/components";
import { PlayerModule } from "src/store";
import { Images } from "src/common/mixins";
import useReactiveMeta from "./meta";
import { LeaderboardSelector } from "./components";
import { setup } from "vue-class-component";
import Auth from "src/auth";
import { AuthState } from "src/auth/interfaces";
import { LeaderboardType, leaderboardTypes, SanctionInformation } from "src/api";

interface Notice {
  id: number;
  text: string;
  color: "negative" | "contrast" | "positive";
}

@Options({ components: { CHero, LeaderboardSelector } })
export default class PlayerPage extends mixins(Images) {
  @Prop() playerName!: string;

  hook = -1;
  showModTools = false;
  showSanctionDialog = false;
  sanctionInfoError = "";
  sanctionInformation: SanctionInformation | null = null;

  notices: Notice[] = [];
  lastNotice = 0;

  editing = false;
  newReason = "";

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

  selectLeaderboard(type: LeaderboardType) {
    window.localStorage.setItem("playerRank.sort", type);
    void this.fetchLeaderboard();
  }

  async fetchLeaderboard() {
    if (!this.player) return;

    let sort = window.localStorage.getItem("playerRank.sort");
    if (!sort || !leaderboardTypes.includes(sort as LeaderboardType)) {
      sort = "stats";
    }

    await this.module.getRank({
      player: this.player,
      rank: sort as LeaderboardType,
    });
  }

  get rank() {
    return this.module.rank;
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

  pushNotice(text: string, color: "negative" | "contrast" | "positive", duration = 5000) {
    const id = ++this.lastNotice;
    this.notices.push({
      id,
      text,
      color,
    });
    window.setTimeout(() => {
      for (let index = 0; index < this.notices.length; index++) {
        const notice = this.notices[index];
        if (notice.id === id) {
          this.notices.splice(index, 1);
          return;
        }
      }
    }, duration);
  }

  async fetchSanction() {
    if (!this.player) return;

    const result = await Auth.mod.getSanction(this.player.id);

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

  showSanctionPanel() {
    if (!this.player) return;
    if (!this.sanctionInformation) {
      void this.fetchSanction();
    }

    this.notices = [];
    this.showSanctionDialog = true;
  }

  async cancelSanction() {
    if (!this.player) return;
    if (!this.sanctionInformation) return;

    const result = await Auth.mod.cancelSanction(this.player.id);
    if (typeof result === "string") {
      this.pushNotice(result, "negative");
    } else {
      this.pushNotice("Sanction has been cancelled successfully.", "positive");
    }

    void this.fetchSanction();
  }

  editSanction() {
    this.editing = true;
  }

  async applySanction() {
    if (!this.player) return;
    if (!this.sanctionInformation) return;

    if (this.newReason.length < 1) {
      this.pushNotice("Sanction reason can't be empty.", "negative");
      return;
    }

    const result = await Auth.mod.sanctionPlayer(this.player.id, this.newReason);
    if (typeof result === "string") {
      this.pushNotice(result, "negative");
    } else {
      this.pushNotice("Sanction applied successfully.", "positive");
      this.editing = false;
    }

    void this.fetchSanction();
  }

  mounted() {
    this.hook = Auth.hook(
      { player: { cfmRoles: ["trainee", "mod", "admin", "dev"] } },
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
    await this.fetchLeaderboard();

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
