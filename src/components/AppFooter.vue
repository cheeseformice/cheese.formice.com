<template>
  <div
    class="col-12 bg-dark text-white q-pa-lg row"
    style="position: absolute; bottom: 0; width: 100%"
  >
    <div class="col-12 col-md-3 text-h6">
      <!-- A community of Transformice addicts -->
      <img src="img/logo.png" style="height: 100px" />
    </div>
    <div class="col-12 col-md-1 q-pa-lg">
      <!-- Separator -->
    </div>
    <footer-section
      v-for="section in sections"
      :key="section.title"
      :title="section.title"
      :items="section.items"
    >
      <template v-slot:Preference>
        <q-list dense class="q-px-sm">
          <q-item style="padding-left: 0; padding-right: 0">
            <q-select
              dark
              v-model="language"
              :options="languageOptions"
              dense
              borderless
              emit-value
              map-options
              options-dense
            />
          </q-item>
        </q-list>
      </template>
    </footer-section>
  </div>
</template>

<script lang="ts">
import { Options, Vue, Watch } from "vue-property-decorator";
import i18n from "src/i18n";
import FooterSection, { FooterItem } from "./FooterSection.vue";

interface FooterSectionInfo {
  title: string;
  items?: FooterItem[];
}

@Options({ components: { FooterSection } })
export default class AppFooter extends Vue {
  language = "en";

  get languageOptions() {
    const languages = Object.keys(i18n) as Array<keyof typeof i18n>;

    return languages.map((l) => ({
      value: l,
      label: i18n[l].languageName,
    }));
  }

  get sections(): FooterSectionInfo[] {
    return [
      {
        title: "Contribute",
        items: [
          {
            label: "Translation",
            to: { name: "translation" },
          },
          {
            label: "Source code",
            to: { name: "github" },
          },
        ],
      },
      {
        title: "Contact us",
        items: [
          {
            label: "Discord",
            link: "https://discord.gg/xeRNaKTKxN",
          },
        ],
      },
      {
        title: "Information",
        items: [
          {
            label: "Frequently Asked Questions",
          },
          {
            label: "Server status",
            to: { name: "status" },
          },
        ],
      },
      {
        title: "Preference",
      },
    ];
  }

  @Watch("language")
  onLanguageChange() {
    this.$i18n.locale = this.language;
  }
}
</script>
