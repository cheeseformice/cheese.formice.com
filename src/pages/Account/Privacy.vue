<template>
  <h5 class="q-my-none">{{ $t("privacySettings") }}</h5>
  <q-separator spaced />

  <div v-html="$t('privacy.information')" />

  <div v-for="field in fields" :key="field.key" class="row items-center">
    <q-toggle v-model="field.public" color="secondary" />
    {{ $t(`privacy.${field.key}`) }}
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import Auth from "src/auth";
import { AuthState } from "src/auth/interfaces";
import { PrivacySettings } from "src/api";

interface ToggleCallback {
  (key: keyof PrivacySettings, value: boolean): Promise<void>;
}

class Field {
  constructor(
    public key: keyof PrivacySettings,
    private _public: boolean,
    private cb: ToggleCallback
  ) {}

  get public(): boolean {
    return this._public;
  }

  set public(value: boolean) {
    this._public = value;
    void this.cb(this.key, value);
  }
}

export default class AccountPrivacy extends Vue {
  fields: Field[] = [];

  hook = -1;

  mounted() {
    this.hook = Auth.hook(
      { logged: true },
      {
        match: (state: AuthState) => {
          if (!state.logged) {
            return;
          } // for the IDE

          const cb = this.onToggleOption.bind(this);
          const fields: Field[] = [];
          for (const keyStr in state.privacy) {
            const key: keyof PrivacySettings = keyStr as keyof PrivacySettings;
            fields.push(new Field(key, state.privacy[key], cb));
          }
          this.fields = fields;
        },
      },
      []
    );
  }

  unmounted() {
    Auth.unhook(this.hook);
  }

  async onToggleOption(key: keyof PrivacySettings, value: boolean) {
    const result = await Auth.account.updatePrivacyField(key, value);
    if (result) {
      console.error(result);
    }
  }
}
</script>
