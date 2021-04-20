<template>
  <q-page class="container text-center">
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
          type="text"
          :label="$t('password')"
          :rules="[(val) => (val && val.length > 0) || '']"
        />
        <div class="row items-center">
          <div class="col-12 col-sm-6 text-left">
            <q-btn outline color="secondary" type="submit" :label="$t('login')" />
          </div>
          <div class="col-12 col-sm-6 text-right">
            <div class="text-secondary cursor-pointer" @click="register">Register</div>
          </div>
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script lang="ts">
import { AuthService } from "src/api/auth";
import { Vue } from "vue-property-decorator";

export default class Login extends Vue {
  username = "";
  password = "";

  async login() {
    if (!this.username || !this.password) return;
    // TODO: Implement
    const response = await AuthService.login(this.username, this.password);
  }

  register() {
    // TODO: Implement
  }
}
</script>

<style lang="scss" scoped>
.login-form {
  max-width: 400px;
}
</style>
