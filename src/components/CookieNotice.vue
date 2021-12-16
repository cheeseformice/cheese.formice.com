<template>
  <q-dialog v-if="$route.name !== 'cookie-policy'" v-model="showNotice" persistent>
    <q-card class="bg-contrast">
      <q-card-section>
        <div class="text-h6">Cookies</div>
      </q-card-section>

      <q-card-section
        class="q-pt-none"
        v-html="$t('cookies.alert', { open: '<a href=\'/cookie-policy\'>', close: '</a>' })"
      ></q-card-section>

      <q-card-actions align="right">
        <q-btn
          outline
          no-caps
          :label="$t('cookies.acceptEssentials')"
          color="secondary"
          @click="accept('essentials')"
        />
        <q-btn
          outline
          no-caps
          :label="$t('cookies.acceptAll')"
          color="secondary"
          @click="accept('all')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

type ConsentType = "all" | "essentials";

export default class CookieNotice extends Vue {
  showNotice = false;

  accept(type: ConsentType) {
    window.localStorage.setItem("cookieConsent", type);
    this.showNotice = false;
    if (type === "all") {
      window.location.reload();
    }
  }

  mounted() {
    const consentType = window.localStorage.getItem("cookieConsent") as ConsentType | null;
    if (consentType === null) {
      this.showNotice = true;
      return;
    }
  }
}
</script>
