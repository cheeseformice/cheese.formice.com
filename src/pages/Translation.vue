<template>
  <q-page padding class="container q-pt-lg">
    <q-table
      :rows="tableData"
      :columns="tableColumns"
      :rows-per-page-options="[0]"
      :pagination="{ page: 1, rowsPerPage: 0 }"
      hide-bottom
      flat
      row-key="key"
    >
      <template #body-cell-key="props">
        <q-td :props="props">
          <code>{{ props.value }}</code>
        </q-td>
      </template>
      <template #body-cell-translation>
        <q-td>
          <q-input outlined dense type="text" placeholder="Translation" />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import i18n from "src/i18n";
import { QTable } from "quasar";

interface TranslationFields {
  [key: string]: string | TranslationFields;
}

interface FlatTranslationField {
  key: string;
  en: string;
  translation: string;
}

export default class Translation extends Vue {
  get tableColumns(): QTable["columns"] {
    return [
      {
        name: "key",
        label: "Key",
        field: "key",
        align: "center",
      },
      {
        name: "en",
        label: "English",
        field: "en",
        align: "center",
      },
      {
        name: "translation",
        label: this.$t("translation"),
        field: "translation",
        align: "center",
      },
    ];
  }

  flattenDictionary(dict: TranslationFields): FlatTranslationField[] {
    const data: FlatTranslationField[] = [];

    for (let [key, value] of Object.entries(dict)) {
      if (typeof value === "string") {
        data.push({
          key,
          en: value,
          translation: ""
        });

      } else {
        const child = this.flattenDictionary(value);

        for (let index = 0; index < child.length; index++) {
          const { key: _key, en, translation } = child[index];
          data.push({
            key: `${key}.${_key}`,
            en,
            translation
          });
        }
      }
    }

    return data;
  }

  get tableData() {
    return this.flattenDictionary(i18n.en);
  }
}
</script>
