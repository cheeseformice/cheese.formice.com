<template>
  <q-dialog v-model="showDialog">
    <q-card class="bg-contrast" v-if="!error">
      <q-card-section>
        <div class="text-h6">{{ $t("changePasswordSuccess") }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ $t("passwordChanged") }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn outline no-caps label="Close" color="secondary" v-close-popup />
      </q-card-actions>
    </q-card>

    <q-card class="bg-contrast" v-else>
      <q-card-section>
        <div class="text-h6">{{ $t("error") }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ $t(error) }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn outline no-caps label="Close" color="secondary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <h5 class="q-my-none">{{ $t("changePassword") }}</h5>
  <q-separator spaced />

  <div v-if="!hasPassword">
    {{ $t("missingPassword") }}
  </div>
  {{ $t("dontReusePassword") }}

  <div class="row q-mt-md">
    <form @submit.prevent="submitPassword" class="col-6" ref="inputs">
      <q-input
        ref="current"
        v-model="currentModel"
        v-if="hasPassword"
        outlined
        dense
        type="password"
        class="col-6"
        :dark="$dark.enabled"
        standout="text-contrast"
        :label="$t('currentPassword')"
        :rules="[(val) => (val && val.length > 0) || '']"
      />
      <q-input
        ref="newer"
        v-model="newerModel"
        outlined
        dense
        type="password"
        class="col-6"
        :dark="$dark.enabled"
        standout="text-contrast"
        :label="$t('newPassword')"
        :rules="[(val) => (val && val.length >= 8) || $t('passwordTooShort')]"
      />
      <q-input
        ref="confirm"
        v-model="confirmModel"
        outlined
        dense
        type="password"
        class="col-6"
        :dark="$dark.enabled"
        standout="text-contrast"
        :label="$t('repeatPassword')"
        :rules="[(val) => val === newerModel || $t('passwordMismatch')]"
      />
      <q-btn
        type="submit"
        :loading="submitting"
        :label="$t('save')"
        class="q-mt-md"
        color="secondary"
      >
        <template v-slot:loading>
          <q-spinner />
        </template>
      </q-btn>
    </form>
  </div>
</template>

<script lang="ts">
import { Ref, Vue } from "vue-property-decorator";
import Auth from "src/auth";
import { AuthState } from "src/auth/interfaces";
import { QInput } from "quasar";

export default class Password extends Vue {
  hasPassword = false;
  hook = -1;

  @Ref() readonly current!: QInput;
  @Ref() readonly newer!: QInput;
  @Ref() readonly confirm!: QInput;

  currentModel = "";
  newerModel = "";
  confirmModel = "";

  submitting = false;
  showDialog = false;
  error?: string;

  mounted() {
    this.hook = Auth.hook(
      { logged: true },
      {
        match: (state: AuthState) => {
          if (!state.logged) {
            return;
          } // for the IDE

          this.hasPassword = state.hasPassword;
        },
      },
      ["hasPassword"]
    );
  }

  async validateInputs(): Promise<boolean> {
    const promises = [this.newer.validate(), this.confirm.validate()];
    if (this.hasPassword) {
      promises.push(this.current.validate());
    }

    const result = await Promise.all(promises);
    return result.every((v) => v === true);
  }

  async submitPassword() {
    if (!(await this.validateInputs())) return;

    this.submitting = true;
    const result = await Auth.authenticator.changePassword(this.currentModel, this.newerModel);
    this.submitting = false;
    this.showDialog = true;

    if (result === true) {
      this.error = undefined;

      window.setTimeout(() => {
        Auth.authenticator.logout();
      }, 3000);
    } else {
      this.error = result || "errors.internal";
    }
  }

  unmounted() {
    Auth.unhook(this.hook);
  }
}
</script>
