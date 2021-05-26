<template>
  <q-dialog v-model="showNotice" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">Cookies</div>
      </q-card-section>

      <q-card-section class="q-pt-none">{{
        $t("cookies.alert", { open: "", close: "" })
      }}</q-card-section>

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

  get consentType(): ConsentType | null {
    return window.localStorage.getItem("cookieConsent") as ConsentType | null;
  }

  accept(type: ConsentType) {
    window.localStorage.setItem("cookieConsent", type);
    this.applyConsent(type);
    this.showNotice = false;
  }

  mounted() {
    if (this.consentType === null) {
      this.showNotice = true;
      return;
    }

    this.applyConsent(this.consentType);
  }

  applyConsent(consentType: ConsentType) {
    if (consentType === "essentials") {
      // essential "cookies" are stored in local storage
      // so we just delete all of this
      let cookies = document.cookie.split(";");

      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let eqPos = cookie.indexOf("=");
        let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }

      Object.defineProperty(document, "cookie", {
        get: function () {
          return "";
        },
        set: function () {
          return true;
        },
      });
    }
  }
}
</script>
