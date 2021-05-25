<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-lg-2">
      <q-card flat bordered class="q-py-md">
        <!-- Look -->
        <div class="text-center">
          <svg width="90" viewBox="0 0 100 110">
            <image :href="look" width="90" />
          </svg>
          <!-- Title -->
          <div>«{{ title }}»</div>
        </div>

        <q-separator spaced inset />

        <!-- Roles -->
        <q-card-section class="q-py-sm q-gutter-xs" v-if="player.cfmRoles || player.tfmRoles">
          <q-badge
            v-for="role in player.cfmRoles"
            outline
            color="primary"
            :key="'cfm-' + role"
            :label="'cfm-' + role"
          />
          <q-badge
            v-for="role in player.tfmRoles"
            outline
            color="secondary"
            :key="role"
            :label="role"
          />
        </q-card-section>

        <!-- Basic Information -->
        <q-list dense>
          <q-item v-for="item in sideItems" :key="item.label">
            <q-item-section>
              <div class="row items-center">
                <div class="col-auto">
                  <q-icon :name="item.icon" color="primary" size="24px" class="q-mr-sm">
                    <q-tooltip anchor="bottom middle" self="center middle">
                      {{ item.label }}
                    </q-tooltip>
                  </q-icon>
                </div>
                <div class="col">
                  <template v-if="item.isLink" class="">
                    <a :href="item.value" target="_blank">{{ item.label }}</a>
                  </template>
                  <template v-else-if="item.to">
                    <router-link :to="item.to">{{ item.value }}</router-link>
                  </template>
                  <template v-else>
                    {{ item.value }}
                  </template>
                </div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>

    <div class="col-12 col-lg-10 q-gutter-y-md">
      <!-- Stats -->
      <div class="q-gutter-y-xs text-center">
        <div class="text-h5">{{ $t("level", { level: experience.level }) }}</div>
        <q-linear-progress :value="experience.percentage" color="cyan-4" size="xl" />
        <div class="text-caption">{{ experience.current }} / {{ experience.needed }}</div>
      </div>

      <div class="q-gutter-y-sm">
        <player-stats col="col-12 col-md-4" :stats="shamanStats" />
        <player-stats :title="$t('normal')" :stats="normalStats" />
        <player-stats :title="$t('racing')" :stats="racingStats" />
        <player-stats :title="$t('survivor')" :stats="survivorStats" />
        <player-stats col="col-12 col-md-4" :title="$t('defilante')" :stats="defilanteStats" />
      </div>

      <div class="text-center">
        <div class="text-h5 q-my-md">{{ $t("badges") }}</div>

        <q-scroll-area horizontal visible style="height: 65px">
          <div class="row no-wrap q-gutter-sm">
            <q-img
              v-for="(badge, i) in badges"
              :key="i"
              :src="badge"
              height="40px"
              width="40px"
              spinner-size="32px"
            />
          </div>
        </q-scroll-area>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mixins, Options } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

import { getExperienceNeeded, getLevel, getTotalExperienceNeeded } from "src/common/level";
import { Images } from "src/common/mixins";
import { PlayerModule } from "src/store";
import { PlayerStats } from "./components";
import { DOMAIN } from "src/common/vars";

@Options({
  components: { PlayerStats },
})
export default class PlayerProfile extends mixins(Images) {
  get module() {
    return getModule(PlayerModule, this.$store);
  }

  get player() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.module.player!;
  }

  get title() {
    return this.module.title;
  }

  get sideItems() {
    const { name, tribe, soulmate } = this.player;
    return [
      {
        label: "Tribe",
        icon: "home",
        value: tribe?.name,
        to: {
          name: "tribe",
          params: { tribeName: tribe?.name },
        },
      },
      {
        label: "Soulmate",
        icon: "favorite",
        value: soulmate?.name,
        to: {
          name: "player",
          params: { playerName: soulmate?.name },
        },
      },
      {
        label: "Atelier801",
        icon: "link",
        isLink: true,
        value: `https://atelier801.com/profile?pr=${encodeURIComponent(name)}`,
      },
    ].filter((i) => i.value);
  }

  get experience() {
    const level = getLevel(this.player.stats.shaman.experience);
    const totalCurrent = this.player.stats.shaman.experience;
    const totalNeeded = getTotalExperienceNeeded(level);
    const needed = getExperienceNeeded(level);
    const current = totalCurrent - getTotalExperienceNeeded(level - 1);
    return {
      level,
      totalCurrent,
      totalNeeded,
      current,
      needed,
      percentage: 1 - (needed - current) / needed,
    };
  }

  get badges() {
    return this.player.badges.map((b) => this.getBadge(b));
  }

  get shamanStats() {
    const { savesNormal, savesHard, savesDivine } = this.player.stats.shaman;
    const progress = this.player.period.shaman;
    return [
      {
        icon: `https://${DOMAIN}/tfm/images/x_transformice/x_divers/x_mc0.jpg`,
        title: this.$t("miceSavedNormal"),
        value: savesNormal,
        progress: progress.savesNormal,
      },
      {
        icon: `https://${DOMAIN}/tfm/images/x_transformice/x_divers/x_mc1.jpg`,
        title: this.$t("miceSavedHard"),
        value: savesHard,
        progress: progress.savesHard,
      },
      {
        icon: `https://${DOMAIN}/tfm/images/x_transformice/x_divers/x_mc2.jpg`,
        title: this.$t("miceSavedDivine"),
        value: savesDivine,
        progress: progress.savesDivine,
      },
    ];
  }

  get normalStats() {
    const { rounds, cheese, first, bootcamp } = this.player.stats.normal;
    const progress = this.player.period.normal;
    return [
      {
        icon: this.getInventory(2259),
        title: this.$t("roundsPlayed"),
        value: rounds,
        progress: progress.rounds,
      },
      {
        icon: this.getInventory(800),
        title: this.$t("gatheredCheese"),
        value: cheese,
        progress: progress.cheese,
      },
      {
        icon: this.getInventory(2254),
        title: this.$t("cheeseGatheredFirst"),
        value: first,
        progress: progress.first,
      },
      {
        icon: this.getInventory(2261),
        title: this.$t("bootcamp"),
        value: bootcamp,
        progress: progress.bootcamp,
      },
    ];
  }

  get racingStats() {
    const stats = this.player.stats.racing;
    const progress = this.player.period.racing;
    return [
      {
        icon: this.getBadge(124),
        title: this.$t("roundsPlayed"),
        value: stats.rounds,
        progress: progress.rounds,
      },
      {
        icon: this.getBadge(125),
        title: this.$t("completedRounds"),
        value: stats.finished,
        progress: progress.finished,
      },
      {
        icon: this.getBadge(127),
        title: this.$t("numberOfPodiums"),
        value: stats.podium,
        progress: progress.podium,
      },
      {
        icon: this.getBadge(126),
        title: this.$t("numberOfFirsts"),
        value: stats.first,
        progress: progress.first,
      },
    ];
  }

  get survivorStats() {
    const stats = this.player.stats.survivor;
    const progress = this.player.period.survivor;
    return [
      {
        icon: this.getBadge(120),
        title: this.$t("roundsPlayed"),
        value: stats.rounds,
        progress: progress.rounds,
      },
      {
        icon: this.getBadge(121),
        title: this.$t("roundsAsShaman"),
        value: stats.shaman,
        progress: progress.shaman,
      },
      {
        icon: this.getBadge(122),
        title: this.$t("killedMice"),
        value: stats.killed,
        progress: progress.killed,
      },
      {
        icon: this.getBadge(123),
        title: this.$t("roundsSurvived"),
        value: stats.survivor,
        progress: progress.survivor,
      },
    ];
  }

  get defilanteStats() {
    const stats = this.player.stats.defilante;
    const progress = this.player.period.defilante;
    return [
      {
        icon: this.getBadge(288),
        title: this.$t("roundsPlayed"),
        value: stats.rounds,
        progress: progress.rounds,
      },
      {
        icon: this.getBadge(287),
        title: this.$t("completedRounds"),
        value: stats.finished,
        progress: progress.finished,
      },
      {
        icon: this.getBadge(286),
        title: this.$t("pointsGathered"),
        value: stats.points,
        progress: progress.points,
      },
    ];
  }

  get look() {
    return this.getLook(this.player);
  }
}
</script>
