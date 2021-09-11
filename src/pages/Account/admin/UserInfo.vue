<template>
  <div>
    <h5 class="q-my-none">Player Information</h5>
    <q-separator spaced />
    <div>
      <c-entity-search :players="true" color="black" :onSelect="selectPlayer" />
    </div>
  </div>
</template>

<script lang="ts">
import { AuthService, NullSessionToken, SessionToken } from "src/api";
import { Vue, Options } from "vue-property-decorator";
import { CEntitySearch } from "src/components";
import { SearchOption } from "src/components/CEntitySearch.vue";

@Options({ components: { CEntitySearch } })
export default class UserInfo extends Vue {
  session: SessionToken = NullSessionToken;

  selectPlayer(player: SearchOption) {
    console.log(player)
  }

  async mounted() {
    const session = await AuthService.getSession();
    if (!session) { return; }

    this.session = session;
  }
}
</script>