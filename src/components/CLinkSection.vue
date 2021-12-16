<template>
  <q-card
    :dark="dark"
    flat
    bordered
    :class="'q-py-none q-mb-sm text-left ' + (contrast ? 'bg-contrast' : '')"
  >
    <div v-if="!!label">
      <q-card-section class="q-py-sm q-px-md">
        <b>{{ label }}</b>
      </q-card-section>
      <q-separator />
    </div>
    <div
      v-for="(link, idx) in links"
      :key="link.label"
      :style="$route.name === link.to.name ? '' : 'cursor: pointer;'"
      @click="$route.name === link.to.name ? '' : $router.push(link.to)"
    >
      <q-card-section class="q-py-sm q-px-md">
        <div class="page-selector" v-if="$route.name === link.to.name"></div>
        {{ link.label }}
      </q-card-section>
      <q-separator v-if="idx < links.length - 1" />
    </div>
  </q-card>
</template>

<style lang="scss" scoped>
.page-selector {
  position: absolute;
  height: 100%;
  width: 3px;
  background-color: $secondary;
  left: 0px;
  top: 0;
}
</style>

<script lang="ts">
import { Vue, Prop } from "vue-property-decorator";

interface Link {
  label: string;
  to: { name: string; params?: Record<string, string> };
}

export default class CLinkSection extends Vue {
  @Prop({ default: "" }) label!: string;
  @Prop({ required: true }) links!: Link[];
  @Prop({ default: false }) dark!: boolean;
  @Prop({ default: true }) contrast!: boolean;
}
</script>
