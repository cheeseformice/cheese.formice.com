<template>
  <div class="row items-center">
    <span class="text-h5 q-my-none">{{ $t("progress") }}</span>
    <q-space />
    <q-select
      outlined
      dense
      v-model="period"
      :options="periods"
      :label="$t('period')"
      :class="$q.screen.gt.sm ? 'selector' : ''"
      :dark="$dark.enabled"
      options-selected-class="text-contrast"
      standout="text-contrast"
    />
  </div>
  <q-separator spaced />

  <div class="col-12 q-mt-md">
    <div class="q-gutter-y-sm">
      <div :key="section.title" v-for="section in sections">
        <div class="text-grey q-pl-sm">{{ section.title }}</div>
        <div class="row">
          <div
            class="q-pa-xs col-12 col-sm-6 col-md-4 col-lg-3"
            :key="stat.title"
            v-for="stat in section.stats"
          >
            <q-card flat bordered class="full-height bg-contrast">
              <q-item class="full-height">
                <q-item-section>
                  <q-item-label>{{ stat.title }}</q-item-label>
                  <q-item-label class="text-h6">
                    <span class="q-mr-sm">{{ stat.value }}</span>
                    <wbr />
                    <span v-if="stat.ratio" class="text-caption text-no-wrap">{{
                      $t("ratio", { value: stat.ratio.toFixed(1) })
                    }}</span>
                  </q-item-label>
                  <q-item-label
                    caption
                    :class="
                      stat.difference > 0
                        ? 'text-green'
                        : stat.difference < 0
                        ? 'text-red'
                        : 'text-contrast'
                    "
                  >
                    {{
                      $t(`progressSince.${period.value}`, {
                        per:
                          typeof stat.percentage === "number"
                            ? stat.percentage.toFixed(1)
                            : stat.percentage,
                        diff: stat.difference,
                      })
                    }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.selector {
  min-width: 225px;
}
</style>

<script lang="ts">
import { LeaderboardPeriod, PeriodStats, Period as APIPeriod } from "src/api";
import { Watch, Vue } from "vue-property-decorator";
import Auth from "src/auth";
import dayjs from "dayjs";

interface Period {
  label: string;
  value: LeaderboardPeriod;
}

export default class AccountProgress extends Vue {
  period: Period = {
    label: "",
    value: "weekly",
  };
  last?: PeriodStats;
  recent?: PeriodStats;

  sections = this.getSections();

  get periods(): Period[] {
    const periods: LeaderboardPeriod[] = ["daily", "weekly", "monthly"];
    return periods.map((period) => ({
      label: this.$t(`periods.${period}`),
      value: period,
    }));
  }

  shamanStats() {
    if (!this.recent || !this.last) return [];
    const last = this.last.shaman;
    const recent = this.recent.shaman;
    const rounds = this.recent.mouse.rounds;

    return [
      {
        translation: "miceSavedNormal",
        key: "savesNormal" as keyof typeof recent,
      },
      {
        translation: "miceSavedHard",
        key: "savesHard" as keyof typeof recent,
      },
      {
        translation: "miceSavedDivine",
        key: "savesDivine" as keyof typeof recent,
      },
      {
        translation: "cheeseGatheredShaman",
        key: "cheese" as keyof typeof recent,
      },
    ].map(({ translation, key }) => ({
      title: this.$t(translation),
      value: recent[key],
      ratio: this.calculateRatio(recent[key], rounds),
      percentage:
        last[key] === 0
          ? recent[key] > 0
            ? "Inf"
            : 0
          : ((recent[key] - last[key]) / last[key]) * 100,
      difference: recent[key] - last[key],
    }));
  }

  mouseStats() {
    if (!this.recent || !this.last) return [];
    const last = this.last.mouse;
    const recent = this.recent.mouse;
    const rounds = this.recent.mouse.rounds;

    return [
      {
        translation: "roundsPlayed",
        key: "rounds" as keyof typeof recent,
        noRatio: true,
      },
      {
        translation: "gatheredCheese",
        key: "cheese" as keyof typeof recent,
      },
      {
        translation: "cheeseGatheredFirst",
        key: "first" as keyof typeof recent,
      },
      {
        translation: "bootcamp",
        key: "bootcamp" as keyof typeof recent,
        noRatio: true,
      },
    ].map(({ translation, key, noRatio }) => ({
      title: this.$t(translation),
      value: recent[key],
      ratio: noRatio ? 0 : this.calculateRatio(recent[key], rounds),
      percentage:
        last[key] === 0
          ? recent[key] > 0
            ? "Inf"
            : 0
          : ((recent[key] - last[key]) / last[key]) * 100,
      difference: recent[key] - last[key],
    }));
  }

  racingStats() {
    if (!this.recent || !this.last) return [];
    const last = this.last.racing;
    const recent = this.recent.racing;
    const rounds = this.recent.racing.rounds;

    return [
      {
        translation: "roundsPlayed",
        key: "rounds" as keyof typeof recent,
        noRatio: true,
      },
      {
        translation: "completedRounds",
        key: "finished" as keyof typeof recent,
      },
      {
        translation: "numberOfPodiums",
        key: "podium" as keyof typeof recent,
      },
      {
        translation: "numberOfFirsts",
        key: "first" as keyof typeof recent,
      },
    ].map(({ translation, key, noRatio }) => ({
      title: this.$t(translation),
      value: recent[key],
      ratio: noRatio ? 0 : this.calculateRatio(recent[key], rounds),
      percentage:
        last[key] === 0
          ? recent[key] > 0
            ? "Inf"
            : 0
          : ((recent[key] - last[key]) / last[key]) * 100,
      difference: recent[key] - last[key],
    }));
  }

  survivorStats() {
    if (!this.recent || !this.last) return [];
    const last = this.last.survivor;
    const recent = this.recent.survivor;
    const rounds = this.recent.survivor.rounds;

    return [
      {
        translation: "roundsPlayed",
        key: "rounds" as keyof typeof recent,
        noRatio: true,
      },
      {
        translation: "roundsAsShaman",
        key: "shaman" as keyof typeof recent,
      },
      {
        translation: "killedMice",
        key: "killed" as keyof typeof recent,
      },
      {
        translation: "roundsSurvived",
        key: "survivor" as keyof typeof recent,
      },
    ].map(({ translation, key, noRatio }) => ({
      title: this.$t(translation),
      value: recent[key],
      ratio: noRatio ? 0 : this.calculateRatio(recent[key], rounds),
      percentage:
        last[key] === 0
          ? recent[key] > 0
            ? "Inf"
            : 0
          : ((recent[key] - last[key]) / last[key]) * 100,
      difference: recent[key] - last[key],
    }));
  }

  defilanteStats() {
    if (!this.recent || !this.last) return [];
    const last = this.last.defilante;
    const recent = this.recent.defilante;
    const rounds = this.recent.defilante.rounds;

    return [
      {
        translation: "roundsPlayed",
        key: "rounds" as keyof typeof recent,
        noRatio: true,
      },
      {
        translation: "completedRounds",
        key: "finished" as keyof typeof recent,
      },
      {
        translation: "pointsGathered",
        key: "points" as keyof typeof recent,
      },
    ].map(({ translation, key, noRatio }) => ({
      title: this.$t(translation),
      value: recent[key],
      ratio: noRatio ? 0 : this.calculateRatio(recent[key], rounds),
      percentage:
        last[key] === 0
          ? recent[key] > 0
            ? "Inf"
            : 0
          : ((recent[key] - last[key]) / last[key]) * 100,
      difference: recent[key] - last[key],
    }));
  }

  getSections() {
    if (!this.recent || !this.last) return [];
    return [
      { title: this.$t("shaman"), stats: this.shamanStats() },
      { title: this.$t("mouse"), stats: this.mouseStats() },
      { title: this.$t("racing"), stats: this.racingStats() },
      { title: this.$t("survivor"), stats: this.survivorStats() },
      { title: this.$t("defilante"), stats: this.defilanteStats() },
    ];
  }

  mounted() {
    Auth.hook(
      {},
      {
        hook: () => {
          Auth.unhook();

          const period = window.localStorage.getItem("progressPeriod");
          for (let index = 0; index < this.periods.length; index++) {
            const option = this.periods[index];
            if (option.value === period) {
              this.period.value = period;
              break;
            }
          }

          this.period.label = this.$t(`periods.${this.period.value}`);
        },
      },
      []
    );
  }

  async fetchPeriods() {
    const state = Auth.getState();
    if (!state.logged) return; // should not happen

    let last: APIPeriod;
    let recent: APIPeriod;
    if (this.period.value === "daily") {
      last = {
        start: dayjs().subtract(2, "days"), // 2 days ago
        end: dayjs().subtract(1, "days"), // yesterday
      };
      recent = {
        start: dayjs().subtract(1, "days"), // yesterday
        end: dayjs(), // today
      };
    } else if (this.period.value === "weekly") {
      if (dayjs().day() === 0) {
        // Today is sunday
        recent = {
          start: dayjs().day(-13), // previous week to last week's monday
          end: dayjs().day(-7), // last week's sunday
        };
      } else {
        recent = {
          start: dayjs().day(-6), // last week's monday
          end: dayjs().day(0), // last sunday
        };
      }
      last = {
        start: recent.start?.day(-6),
        end: recent.start?.day(0),
      };
    } else {
      last = {
        start: dayjs().date(0).date(0).date(1), // start day of previous to last month
        end: dayjs().date(0).date(0), // last day of previous to last month
      };
      recent = {
        start: dayjs().date(0).date(1), // start day of last month
        end: dayjs().date(0), // last day of last month
      };
    }

    [this.last, this.recent] = await Promise.all([
      Auth.account.getProgress({
        ...last,
        recent: true,
      }),
      Auth.account.getProgress({
        ...recent,
        recent: true,
      }),
    ]);
    this.sections = this.getSections();
  }

  @Watch("period", { deep: true })
  onPeriodChange() {
    window.localStorage.setItem("progressPeriod", this.period.value);
    void this.fetchPeriods();
  }

  calculateRatio(stat: number, rounds: number) {
    if (rounds > 0) return (stat / rounds) * 100;

    return 0;
  }
}
</script>
