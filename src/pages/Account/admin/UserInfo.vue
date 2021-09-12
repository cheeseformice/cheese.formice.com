<template>
  <div>
    <h5 class="q-my-none">Player Information</h5>
    <q-separator spaced />
    <div>
      <c-entity-search :players="true" :tribes="false" color="black" :onSelect="selectPlayer" />

      <div class="q-mb-sm" v-if="player.id > 0" ></div>
      <q-card flat bordered v-if="player.id > 0">
        <q-item>
          <q-item-section avatar>
            <q-avatar square>
              <img :src="getAvatar(player.id || 0, false, false)" />
            </q-avatar>
          </q-item-section>

          <q-separator vertical size="2px" />

          <q-item-section class="q-ml-md">
            <q-item-label>{{ player.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { AuthService, NullSessionToken, SessionToken } from "src/api";
import { mixins } from "vue-property-decorator";
import { SearchOption, NullSearchOption } from "src/components/CEntitySearch.vue";
import { Images } from "src/common/mixins";

export default class UserInfo extends mixins(Images) {
  session: SessionToken = NullSessionToken;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  player: SearchOption = NullSearchOption;

  selectPlayer(player: SearchOption) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.player = player;
  }

  async mounted() {
    const session = await AuthService.getSession();
    if (!session) { return; }

    this.session = session;
  }
}
</script>