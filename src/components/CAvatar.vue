<template>
  <q-avatar square>
    <img
      :src="src"
      :onerror="`this.onerror=null;this.src='https://avatars.atelier801.com/0/0.jpg';`"
      :alt="id"
    />
  </q-avatar>
</template>

<script lang="ts">
import { mixins, Prop } from "vue-property-decorator";
import { Images } from "src/common/mixins";

export default class CAvatar extends mixins(Images) {
  @Prop({ required: true }) id!: number;
  @Prop({ default: false }) min!: boolean;

  get src() {
    return this.getAvatar(this.id, this.min);
  }
}
</script>
