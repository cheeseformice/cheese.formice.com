<template>
  <div class="col-12 col-sm-6 col-md-2 q-pb-md">
    <div class="text-grey q-px-sm text-uppercase text-bold">{{ title }}</div>
    <slot :name="label">
      <q-list dense class="q-px-sm">
        <q-item v-for="item in items" :key="item.label" style="padding-left: 0; padding-right: 0">
          <q-item-section>
            <template v-if="item.link">
              <a :href="item.link" target="_blank" class="text-white">{{ item.label }}</a>
            </template>
            <template v-else-if="item.to">
              <router-link :to="item.to" class="text-white">{{ item.label }}</router-link>
            </template>
            <template v-else>
              {{ item.label }}
            </template>
          </q-item-section>
        </q-item>
      </q-list>
    </slot>
  </div>
</template>

<script lang="ts">
import { Prop, Vue } from "vue-property-decorator";

export interface FooterItem {
  label: string;
  isLink?: boolean;
  link?: string;
  to?: {
    name: string;
  };
}

export default class FooterSection extends Vue {
  @Prop({}) title!: string;
  @Prop({}) label!: string;
  @Prop({ default: () => [] }) items!: FooterItem[];
}
</script>
