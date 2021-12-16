<template>
  <q-page padding class="container q-pt-lg">
    <q-card flat class="col-12 text-center text-h6 q-mb-md transparent">
      {{ $t("faq") }}
    </q-card>

    <div class="row q-col-gutter-sm">
      <div v-for="question in questions" :key="question" class="col-12 col-md-4 full-height">
        <q-card flat bordered class="bg-contrast">
          <q-card-section
            v-ripple
            class="q-hoverable cursor-pointer"
            @click="dropdown(`#faq-${question}`)"
          >
            <div class="text-center">
              {{ $t(`questions.${question}.title`) }}
            </div>
          </q-card-section>

          <div :id="`faq-${question}`" class="hidden">
            <q-separator />
            <q-card-section
              class="text-left"
              v-html="$t(`questions.${question}.answer`, questionParams[question])"
            ></q-card-section>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import i18n from "src/i18n";

const discordLink = '<a href="https://discord.gg/xeRNaKTKxN" target="_blank">';

export default class FAQ extends Vue {
  questions: string[] = Object.keys(i18n.en.questions);
  questionParams: Record<string, Record<string, string>> = {
    suggestion: {
      open: discordLink,
      close: "</a>",
    },
    dislikeLeaderboard: {
      open: discordLink,
      close: "</a>",
    },
    contribute: {
      ghopen: '<a href="/github">',
      tropen: '<a href="/translation">',
      dopen: discordLink,
      close: "</a>",
    },
  };

  dropdown(selector: string) {
    const element = document.querySelector(selector);
    if (element === null) {
      return;
    }

    element.classList.toggle("hidden");
  }
}
</script>
