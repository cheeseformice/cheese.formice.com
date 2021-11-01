<template>
  <q-page class="container text-center">
    <q-dialog v-model="showError">
      <q-card>
        <q-card-section>
          <div class="text-h6">Error</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <span class="text-negative">
            <q-icon name="warning" color="warning" size="1rem" />
            {{ errorMessage }}<br />
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn outline no-caps label="Close" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showRegister">
      <q-card>
        <q-card-section>
          <div class="text-h6">Register</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <span class="text-negative">
            <q-icon name="warning" color="warning" size="1rem" />
            Registration is currently disabled.<br />
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn outline no-caps label="Close" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <h3 class="">{{ $t("login") }}</h3>
    <q-form @submit.prevent="login" class="login-form q-mx-auto">
      <div>
        <q-input
          v-model="username"
          outlined
          type="text"
          :label="$t('username')"
          :rules="[(val) => (val && val.length > 0) || '']"
        />
        <q-input
          v-model="password"
          outlined
          type="password"
          :label="$t('password')"
          :rules="[(val) => (val && val.length > 0) || '']"
        />
        <q-checkbox v-model="rememberMe" label="Remember me" />
        <div class="row items-center">
          <div class="col-12 col-sm-6 text-left">
            <q-btn outline color="secondary" type="submit" :label="$t('login')" @click="login" />
          </div>
          <div class="col-12 col-sm-6 text-right">
            <div
              class="text-secondary cursor-pointer"
              @click="register"
              v-text="$t('register')"
            ></div>
          </div>
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script lang="ts">
import Auth from "src/auth";
import { Vue } from "vue-property-decorator";

export default class Login extends Vue {
  username = "";
  password = "";
  showRegister = false;
  showError = false;
  errorMessage = "";
  rememberMe = false;

  mounted() {
    Auth.hook({ logged: false }, {
      mismatch: () => {
        void this.$router.push({ name: "account" });
        Auth.unhook();
      }
    }, []);
  }

  async login() {
    if (!this.username || !this.password) return;
    const response = await Auth.authenticator.login(this.username, this.password, this.rememberMe);

    if (!response.success) {
      this.showError = true;
      this.errorMessage = response.message || "Something went wrong.";
    }
  }

  register() {
    this.showRegister = true;
  }
}
</script>

<style lang="scss" scoped>
.login-form {
  max-width: 400px;
}
</style>
