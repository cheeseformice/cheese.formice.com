<template>
  <q-avatar square :size="size">
    <img :src="src" :onerror="`this.onerror=null;this.src='${this.default}';`" :alt="id" />
  </q-avatar>
</template>

<script lang="ts">
import { mixins, Prop } from "vue-property-decorator";
import { Images } from "src/common/mixins";

export default class CAvatar extends mixins(Images) {
  @Prop({ required: true }) id!: number;
  @Prop({ default: false }) min!: boolean;
  @Prop({ default: false }) tribe!: boolean;
  @Prop({ default: "" }) size!: string;

  get default() {
    if (!this.tribe) {
      // avatar 0 doesn't have a min version...
      return this.getAvatar(0, false, false);
    } else {
      return this.getImage("x_tribulle2/maison-tribu.png");
    }
  }

  get src() {
    return this.default;
    return this.getAvatar(this.id, this.min, this.tribe);
  }
}
</script>
