<template>
  <q-parallax :src="img" :height="250">
    <div class="container">
      <div class="row top-hero q-gutter-x-md items-center">
        <!-- <c-avatar size="128px" :id="id" :tribe="tribe" v-if="$q.screen.gt.sm" /> -->
        <div :class="tribeClass" v-if="tribe">
          {{ title }}
        </div>
        <div :class="playerClass" v-else>
          <span :class="`${namecolor} name`">{{ name }}</span>
          <span class="tag">{{ tag }}</span>
          <div class="row" v-if="filteredCfmRoles.length + tfmRoles.length > 0">
            <q-icon
              v-for="role in filteredCfmRoles"
              size="sm"
              :name="`mdi:${cfmBadge(role)}`"
              :key="role"
              :class="`cfm-${role} badge`"
            >
              <q-tooltip anchor="bottom middle" self="center middle">
                <span style="font-size: 0.75rem">{{ $t(`roles.cfm${role}`) }}</span>
              </q-tooltip>
            </q-icon>
            <q-badge
              v-for="role in tfmRoles"
              outline
              :class="`${role} badge tfm-badge`"
              :key="role"
              :label="$t(`roles.${role}`).toUpperCase()"
            />
          </div>
        </div>
        <q-space v-if="showRank" />
        <div
          class="shadow soopafresh rank q-mr-xl"
          v-if="showRank && rank.canQualify && !rank.disqualified"
        >
          <q-tooltip anchor="top middle" self="center middle" class="q-md" v-if="rank.approximate">
            <span style="font-size: 1.25em">{{ $t("playerRank.approximate") }}</span>
          </q-tooltip>
          <span class="text-h4" v-if="rank.pos < 1000">#{{ decimal(rank.pos) }}</span>
          <span class="text-h5" v-else>#{{ decimal(rank.pos) }}</span>
          <br />
          <span>{{ $t("playerRank.total", { total: decimal(rank.total) }) }}</span>
          <br />
          <q-badge
            outline
            class="rank-badge cursor-pointer"
            :label="$t(`sorts.${rank.lbType}`).toUpperCase()"
            id="player-rank-lb-type-lg"
          />
        </div>
        <div class="shadow soopafresh rank q-mr-xl" v-else-if="showRank">
          <span class="text-h4">?</span><br />
          <q-badge
            outline
            class="rank-badge"
            :label="
              (!rank.canQualify
                ? $t('playerRank.cantQualify')
                : $t('playerRank.disqualified')
              ).toUpperCase()
            "
          />
        </div>
      </div>
    </div>
    <div class="absolute-bottom tabs">
      <div class="container">
        <q-tabs class="text-white" align="left">
          <q-route-tab
            class="text-white"
            v-for="tab in tabs"
            :key="tab.label"
            :label="tab.label"
            :to="tab.to"
          />
          <q-tab
            class="text-white"
            v-for="btn in buttons"
            :key="btn.label"
            :label="btn.label"
            @click="btn.click"
          />
        </q-tabs>
      </div>
    </div>
  </q-parallax>
</template>

<style lang="scss" scoped>
.rank-badge {
  color: $secondary;
  background-color: rgba($secondary, 0.6);
  text-shadow: 1px 1px 2px black, -1px 1px 2px black, -1px -1px 2px black, 1px -1px 2px black !important;
}
.rank {
  color: $secondary;
  text-align: right;
  text-shadow: 1px 1px 4px black, -1px 1px 4px black, -1px -1px 4px black, 1px -1px 4px black !important;
}
</style>

<script lang="ts">
import { Options, Prop, Vue } from "vue-property-decorator";
import { RouteLocationRaw } from "vue-router";
import { CAvatar } from "src/components";
import { CfmRole, TfmRole } from "src/api";
import { RankInfo } from "src/store/modules/Player";
import { decimal } from "src/common/vars";

interface Callback {
  (): void;
}

const defaultRank: RankInfo = {
  canQualify: false,
  disqualified: false,
};

@Options({ components: { CAvatar } })
export default class Hero extends Vue {
  @Prop({ default: 0 }) id!: number;
  @Prop({ default: false }) tribe!: boolean;
  @Prop({ default: "" }) title!: string;
  @Prop({ default: "" }) img!: string;
  @Prop({ default: [] }) tabs!: { label: string; to: RouteLocationRaw }[];
  @Prop({ default: [] }) buttons!: { label: string; click: Callback }[];
  @Prop({ default: [] }) cfmRoles!: CfmRole[];
  @Prop({ default: [] }) tfmRoles!: TfmRole[];
  @Prop({ default: defaultRank }) rank!: RankInfo;

  decimal = decimal;

  get filteredCfmRoles() {
    return this.cfmRoles.filter((role) => role !== "trainee");
  }

  get tribeClass() {
    let cls = "tribe-shadow text-weight-medium text-white";
    if (!this.$q.screen.gt.sm) {
      cls += " text-h5 q-ml-xl";
    } else {
      cls += " text-h3";
    }
    return cls;
  }

  get playerClass() {
    let cls = "shadow soopafresh";
    if (!this.$q.screen.gt.sm) {
      cls += " text-h5 q-ml-xl";
    } else {
      cls += " text-h3";
    }
    return cls;
  }

  get showRank() {
    return !this.tribe && this.$q.screen.gt.xs;
  }

  get name() {
    return this.title.split("#", 2)[0];
  }

  get tag() {
    return "#" + this.title.split("#", 2)[1];
  }

  get namecolor() {
    return this.tfmRoles.length > 0 ? this.tfmRoles[0] : "player";
  }

  cfmBadge(role: CfmRole): string | void {
    switch (role) {
      case "dev":
        return "shield-bug";
      case "admin":
        return "crown";
      case "mod":
        return "gavel";
      case "translator":
        return "web-plus";
      case "trainee":
        return;
    }
  }
}
</script>

<style scoped>
.top-hero {
  transform: translate(0px, -25px);
}

.avatar {
  width: 128px;
  height: 128px;
  overflow: hidden;
}

.avatar img {
  width: 134px;
  height: 134px;
  margin: -3px -3px;
}

.tribe-shadow {
  text-shadow: 0px 0px 16px black;
}

.shadow {
  text-shadow: 2px 2px 3px black, -2px 2px 3px black, -2px -2px 3px black, 2px -2px 3px black;
}

.name {
  color: rgb(var(--color));
  margin-right: 1rem;
}

.tfm-badge {
  background-color: rgba(var(--color), 0.6);
  margin-right: 0.5em;
  text-shadow: 1px 1px 2px black, -1px 1px 2px black, -1px -1px 2px black, 1px -1px 2px black !important;
}

.badge {
  color: rgb(var(--color));
  margin-right: 0.25em;
  text-shadow: 0px 0px 10px black;
}

.cfm-translator {
  --color: 204, 79, 242;
}

.cfm-mod {
  --color: 215, 232, 42;
}

.cfm-admin {
  --color: 235, 29, 81;
}

.cfm-dev {
  --color: 235, 29, 81;
}

.player {
  --color: 0, 157, 157;
}

.discorderator {
  --color: 231, 142, 226;
}

.event {
  --color: 240, 211, 173;
}

.flash {
  --color: 194, 194, 218;
}

.fashion {
  --color: 239, 152, 170;
}

.funcorp {
  --color: 248, 159, 75;
}

.module {
  --color: 122, 201, 196;
}

.mapcrew {
  --color: 46, 114, 203;
}

.sentinel {
  --color: 48, 186, 118;
}

.mod {
  --color: 186, 189, 47;
}

.admin {
  --color: 235, 29, 81;
}

.tag {
  color: #60608f;
  font-size: 0.75em;
}

.tabs {
  background-color: rgba(0, 0, 0, 0.75);
}
</style>
