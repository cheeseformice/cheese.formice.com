<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-lg-2">
      <q-card flat bordered class="q-py-md bg-contrast">
        <!-- Look -->
        <div class="text-center">
          <svg width="90" viewBox="0 0 100 110">
            <image :href="look" width="90" />
          </svg>
          <!-- Title -->
          <div v-html="`«${title}»`" />
        </div>

        <q-separator spaced inset />

        <!-- Basic Information -->
        <q-list dense>
          <q-item v-if="!$q.screen.gt.xs">
            <q-item-section>
              <div class="row items-center">
                <div class="col-auto">
                  <q-icon name="leaderboard" color="accent" size="24px" class="q-mr-sm">
                    <q-tooltip
                      anchor="bottom middle"
                      self="center middle"
                      v-if="rank.canQualify && !rank.disqualified && rank.approximate"
                    >
                      {{ $t("playerRank.approximate") }}
                    </q-tooltip>
                  </q-icon>
                </div>
                <div class="col">
                  <span v-if="!rank.canQualify">
                    {{ $t("playerRank.cantQualify") }}
                  </span>
                  <span v-else-if="rank.disqualified">
                    {{ $t("playerRank.disqualified") }}
                  </span>
                  <div v-else>
                    <span
                      v-html="
                        $t('playerRank.mobile', {
                          pos: decimal(rank.pos),
                          total: decimal(rank.total),
                        })
                      "
                    />
                    <q-badge
                      outline
                      class="rank-badge cursor-pointer text-contrast"
                      :label="$t(`sorts.${rank.lbType}`).toUpperCase()"
                      id="player-rank-lb-type-sm"
                    />
                  </div>
                </div>
              </div>
            </q-item-section>
          </q-item>
          <q-item v-for="item in sideItems" :key="item.label">
            <q-item-section>
              <div class="row items-center">
                <div class="col-auto">
                  <q-icon :name="item.icon" size="24px" class="q-mr-sm text-contrast">
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
        <q-linear-progress
          :value="experience.percentage"
          color="cyan-4"
          :dark="$dark.enabled"
          size="xl"
        />
        <div class="text-caption">{{ experience.current }} / {{ experience.needed }}</div>
      </div>

      <div class="q-gutter-y-sm">
        <player-stats :title="$t('shaman')" :stats="shamanStats" />
        <player-stats :title="$t('mouse')" :stats="mouseStats" />
        <player-stats :title="$t('racing')" :stats="racingStats" />
        <player-stats :title="$t('survivor')" :stats="survivorStats" />
        <player-stats col="col-12 col-md-4" :title="$t('defilante')" :stats="defilanteStats" />
      </div>

      <div class="text-center" v-if="badges.length > 0">
        <div class="text-h5 q-my-md">{{ $t("badges") }}</div>

        <q-scroll-area horizontal visible style="height: 65px">
          <div class="row no-wrap q-gutter-sm">
            <q-img
              v-for="(badge, i) in badges"
              :key="i"
              :src="badge"
              loading="lazy"
              height="40px"
              width="40px"
              no-spinner
            />
          </div>
        </q-scroll-area>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rank-badge {
  margin-left: 0.5rem;
  font-weight: 600;
  background-color: rgba($accent, 0.6);
  border: none;
}
</style>

<script lang="ts">
import { mixins, Options } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

import { getExperienceNeeded, getLevel, getTotalExperienceNeeded } from "src/common/level";
import { Images } from "src/common/mixins";
import { PlayerModule } from "src/store";
import { PlayerStats } from "./components";
import { decimal } from "src/common/vars";

@Options({
  components: { PlayerStats },
})
export default class PlayerProfile extends mixins(Images) {
  test = false;
  decimal = decimal;

  get module() {
    return getModule(PlayerModule, this.$store);
  }

  get player() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.module.player!;
  }

  get rank() {
    return this.module.rank;
  }

  get title() {
    return this.module.title;
  }

  get sideItems() {
    const { name, tribe, soulmate } = this.player;
    const [year, month] = this.player.registration.split("-");

    let lastLogin;
    if (this.player.lastLogin) {
      lastLogin = new Date(this.player.lastLogin).toLocaleString();
    }

    return [
      {
        label: this.$t("registration"),
        value: `${month}/${year}`,
        icon: "alarm",
      },
      {
        label: this.$t("lastLogin"),
        value: lastLogin,
        icon: "timer",
      },
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
    const { savesNormal, savesHard, savesDivine, cheese } = this.player.stats.shaman;
    const rounds = this.player.stats.mouse.rounds;
    const progress = this.player.period.shaman;
    const progressRounds = this.player.period.mouse.rounds;
    return [
      {
        icon: this.getImage("x_transformice/x_divers/x_mc0.jpg"),
        title: this.$t("miceSavedNormal"),
        value: savesNormal,
        ratio: this.calculateRatio(savesNormal, rounds),
        progress: progress.savesNormal,
        progressRatio: this.calculateRatio(progress.savesNormal, progressRounds),
      },
      {
        icon: this.getImage("x_transformice/x_divers/x_mc1.jpg"),
        title: this.$t("miceSavedHard"),
        value: savesHard,
        ratio: this.calculateRatio(savesHard, rounds),
        progress: progress.savesHard,
        progressRatio: this.calculateRatio(progress.savesHard, progressRounds),
      },
      {
        icon: this.getImage("x_transformice/x_divers/x_mc2.jpg"),
        title: this.$t("miceSavedDivine"),
        value: savesDivine,
        ratio: this.calculateRatio(savesDivine, rounds),
        progress: progress.savesDivine,
        progressRatio: this.calculateRatio(progress.savesDivine, progressRounds),
      },
      {
        icon: this.getInventory(800),
        title: this.$t("cheeseGatheredShaman"),
        value: cheese,
        ratio: this.calculateRatio(cheese, rounds),
        progress: progress.cheese,
        progressRatio: this.calculateRatio(progress.cheese, progressRounds),
      },
    ];
  }

  get mouseStats() {
    const { rounds, cheese, first, bootcamp } = this.player.stats.mouse;
    const progress = this.player.period.mouse;
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
        ratio: this.calculateRatio(cheese, rounds),
        progress: progress.cheese,
        progressRatio: this.calculateRatio(progress.cheese, progress.rounds),
      },
      {
        icon: this.getInventory(2254),
        title: this.$t("cheeseGatheredFirst"),
        value: first,
        ratio: this.calculateRatio(first, rounds),
        progress: progress.first,
        progressRatio: this.calculateRatio(progress.first, progress.rounds),
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
    const { rounds, finished, podium, first } = this.player.stats.racing;
    const progress = this.player.period.racing;
    return [
      {
        icon: this.getBadge(124),
        title: this.$t("roundsPlayed"),
        value: rounds,
        progress: progress.rounds,
      },
      {
        icon: this.getBadge(125),
        title: this.$t("completedRounds"),
        value: finished,
        ratio: this.calculateRatio(finished, rounds),
        progress: progress.finished,
        progressRatio: this.calculateRatio(progress.finished, progress.rounds),
      },
      {
        icon: this.getBadge(127),
        title: this.$t("numberOfPodiums"),
        value: podium,
        ratio: this.calculateRatio(podium, rounds),
        progress: progress.podium,
        progressRatio: this.calculateRatio(progress.podium, progress.rounds),
      },
      {
        icon: this.getBadge(126),
        title: this.$t("numberOfFirsts"),
        value: first,
        ratio: this.calculateRatio(first, rounds),
        progress: progress.first,
        progressRatio: this.calculateRatio(progress.first, progress.rounds),
      },
    ];
  }

  get survivorStats() {
    const { rounds, shaman, killed, survivor } = this.player.stats.survivor;
    const progress = this.player.period.survivor;
    return [
      {
        icon: this.getBadge(120),
        title: this.$t("roundsPlayed"),
        value: rounds,
        progress: progress.rounds,
      },
      {
        icon: this.getBadge(121),
        title: this.$t("roundsAsShaman"),
        value: shaman,
        ratio: this.calculateRatio(shaman, rounds),
        progress: progress.shaman,
        progressRatio: this.calculateRatio(progress.shaman, progress.rounds),
      },
      {
        icon: this.getBadge(122),
        title: this.$t("killedMice"),
        value: killed,
        ratio: this.calculateRatio(killed, rounds),
        progress: progress.killed,
        progressRatio: this.calculateRatio(progress.killed, progress.rounds),
      },
      {
        icon: this.getBadge(123),
        title: this.$t("roundsSurvived"),
        value: survivor,
        ratio: this.calculateRatio(survivor, rounds),
        progress: progress.survivor,
        progressRatio: this.calculateRatio(progress.survivor, progress.rounds),
      },
    ];
  }

  get defilanteStats() {
    const { rounds, finished, points } = this.player.stats.defilante;
    const progress = this.player.period.defilante;
    return [
      {
        icon: this.getBadge(288),
        title: this.$t("roundsPlayed"),
        value: rounds,
        progress: progress.rounds,
      },
      {
        icon: this.getBadge(287),
        title: this.$t("completedRounds"),
        value: finished,
        ratio: this.calculateRatio(finished, rounds),
        progress: progress.finished,
        progressRatio: this.calculateRatio(progress.finished, progress.rounds),
      },
      {
        icon: this.getBadge(286),
        title: this.$t("pointsGathered"),
        value: points,
        ratio: this.calculateRatio(points, rounds),
        progress: progress.points,
        progressRatio: this.calculateRatio(progress.points, progress.rounds),
      },
    ];
  }

  get look() {
    return this.getLook(this.player);
  }

  calculateRatio(stat: number, rounds: number) {
    if (rounds > 0) return (stat / rounds) * 100;

    return 0;
  }
}
</script>
