<template>
  <div>
    <div class="text-grey q-pl-sm">{{ title }}</div>
    <div class="row">
      <div v-for="(s, i) in stats" :key="i" class="q-pa-xs" :class="col">
        <q-card flat bordered class="full-height bg-contrast">
          <q-item class="full-height">
            <q-item-section avatar v-if="s.icon">
              <q-avatar square>
                <img :src="s.icon" />
              </q-avatar>
            </q-item-section>

            <q-separator v-if="s.icon" vertical size="2px" />

            <q-item-section class="q-ml-md">
              <q-item-label>{{ s.title }}</q-item-label>
              <q-item-label class="text-h6">
                <span class="q-mr-sm">{{ s.value }}</span>
                <wbr />
                <span v-if="s.ratio" class="text-caption text-no-wrap">{{
                  $t("ratio", { value: s.ratio.toFixed(1) })
                }}</span>
              </q-item-label>
              <q-item-label
                caption
                v-if="s.progress !== 0"
                :class="s.progress >= 0 ? 'text-green' : 'text-red'"
              >
                {{
                  $t("sinceLastSevenDays", {
                    sign: s.progress >= 0 ? "+" : "",
                    value: s.progress,
                  })
                }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Vue } from "vue-property-decorator";

export default class Stats extends Vue {
  @Prop() title!: string;
  @Prop({ default: "col-12 col-sm-6 col-lg-3" }) col!: string;
  @Prop() stats!: {
    icon: string;
    title: string;
    value: number;
    ratio: number;
    progress: number;
  }[];
}
</script>
