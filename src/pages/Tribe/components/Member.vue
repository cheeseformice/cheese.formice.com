<template>
  <div class="q-pa-xs" :class="col">
    <q-card flat bordered class="bg-contrast">
      <q-item
        :to="{
          name: 'player',
          params: { playerName: name },
        }"
      >
        <q-item-section avatar>
          <c-avatar :id="id" />
        </q-item-section>

        <q-separator vertical size="2px" />

        <q-item-section class="q-ml-md">
          <q-item-label
            >{{ pos }}. <span class="text-bold">{{ name }}</span></q-item-label
          >
          <q-item-label v-if="!!stat">
            <span v-html="$t(`statValue.${sort}`, { stat: `<strong>${stat}</strong>` })"></span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
  </div>
</template>

<script lang="ts">
import { Options, Prop, Vue } from "vue-property-decorator";
import { CAvatar } from "src/components";

@Options({ components: { CAvatar } })
export default class Member extends Vue {
  @Prop() name!: string;
  @Prop() pos!: number;
  @Prop() id!: string;
  @Prop({ default: "col-12 col-sm-6 col-md-4 col-lg-3" }) col!: string;
  @Prop() sort?: string | null;
  @Prop() stat?: number | null;
}
</script>
