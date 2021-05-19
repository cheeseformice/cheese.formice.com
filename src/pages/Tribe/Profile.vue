<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-lg-2">
      <q-card flat bordered class="q-py-md">
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
      <div class="q-gutter-y-sm">
        <tribe-stats col="col-12 col-sm-6" :stats="memberStats" />
        <tribe-stats col="col-12 col-sm-6 col-md-4" :stats="shamanStats" />
        <tribe-stats :title="$t('normal')" :stats="normalStats" />
        <tribe-stats :title="$t('racing')" :stats="racingStats" />
        <tribe-stats :title="$t('survivor')" :stats="survivorStats" />
        <tribe-stats col="col-12 col-sm-6 col-md-4" :title="$t('defilante')" :stats="defilanteStats" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mixins, Options } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

import { Images } from "src/common/mixins";
import { TribeModule } from "src/store";
import { TribeStats } from "./components";

interface SideItems {
  label: string;
  icon: string;
  isLink?: boolean;
  value: string;
  to?: {
    name?: "player" | "tribe";
    params: {
      playerName?: string;
      tribeName?: string;
    }
  };
}

@Options({
  components: { TribeStats },
})
export default class TribeProfile extends mixins(Images) {
  get module () {
    return getModule(TribeModule, this.$store);
  }

  get tribe() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.module.tribe!;
  }

  get sideItems(): SideItems[] {
    const { id } = this.tribe;
    return [
      {
        label: "Atelier801",
        icon: "link",
        isLink: true,
        value: `https://atelier801.com/tribe?tr=${encodeURIComponent(id)}`,
      },
    ].filter((i) => i.value);
  }

  get memberStats() {
    const { total, active } = this.tribe.members;
    const progress = this.tribe.period;
    return [
      {
        icon: this.getInventory(2192),
        title: this.$t("totalMemberCount"),
        value: total,
        progress: progress.members,
      },
      {
        icon: this.getInventory(2194),
        title: this.$t("activeMemberCount"),
        value: active,
        progress: progress.active,
      },
    ]
  }

  get shamanStats() {
    const { savesNormal, savesHard, savesDivine } = this.tribe.stats.shaman;
    const progress = this.tribe.period.shaman;
    return [
      {
        icon: "https://cfmtest.tk/tfm/images/x_transformice/x_divers/x_mc0.jpg",
        title: this.$t("miceSavedNormal"),
        value: savesNormal,
        progress: progress.savesNormal,
      },
      {
        icon: "https://cfmtest.tk/tfm/images/x_transformice/x_divers/x_mc1.jpg",
        title: this.$t("miceSavedHard"),
        value: savesHard,
        progress: progress.savesHard,
      },
      {
        icon: "https://cfmtest.tk/tfm/images/x_transformice/x_divers/x_mc2.jpg",
        title: this.$t("miceSavedDivine"),
        value: savesDivine,
        progress: progress.savesDivine,
      },
    ];
  }

  get normalStats() {
    const { rounds, cheese, first, bootcamp } = this.tribe.stats.normal;
    const progress = this.tribe.period.normal;
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
    const stats = this.tribe.stats.racing;
    const progress = this.tribe.period.racing;
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
    const stats = this.tribe.stats.survivor;
    const progress = this.tribe.period.survivor;
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
    const stats = this.tribe.stats.defilante;
    const progress = this.tribe.period.defilante;
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
}
</script>
