<template>
  <div class="col-12 bg-dark text-white q-pa-lg row">
    <div class="col-12 col-md-3 text-h6">
      <!-- A community of Transformice addicts -->
      <img src="img/logo.png" style="height:100px;" />
    </div>
    <div class="col-12 col-md-1 q-pa-lg">
      <!-- Separator -->
    </div>
    <footer-section
      v-for="section in sections"
      :key="section.title"
      :title="section.title"
      :items="section.items"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-property-decorator";
import { FooterItem } from "./FooterSection.vue";
import FooterSection from "./FooterSection.vue";

interface FooterSectionInfo {
  title: string;
  items: FooterItem[];
}

@Options({ components: { FooterSection } })
export default class AppFooter extends Vue {
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
        ]
      },
      {
        title: "Contact us",
        items: [
          {
            label: "Discord",
            link: "https://discord.gg/xeRNaKTKxN",
          },
        ]
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
        ]
      },
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
        ]
      },
    ];
  }
}
</script>