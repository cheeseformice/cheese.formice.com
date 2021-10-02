<template>
  <div>
    <div class="text-grey q-pl-sm">{{ title }}</div>
    <div class="row">
      <div v-for="(s, i) in stats" :key="i" class="q-pa-xs" :class="col">
        <q-card flat bordered>
          <q-item>
            <q-item-section avatar v-if="s.icon">
              <q-avatar square>
                <img :src="s.icon" />
              </q-avatar>
            </q-item-section>

            <q-separator v-if="s.icon" vertical size="2px" />

            <q-item-section class="q-ml-md">
              <q-item-label>{{ s.title }}</q-item-label>
              <q-item-label class="text-h6">
                {{ s.value }}
                <span v-if="s.ratio" class="text-caption q-ml-xs">Ratio: {{ s.ratio }}</span>
              </q-item-label>
              <q-item-label caption class="text-green">
                <template v-if="s.progress">
                  {{ $t("sinceLastSevenDays", { sign: "+", value: s.progress }) }}
                </template>
                <wbr />
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
    ratio: string;
    progress: number;
  }[];
}
</script>
