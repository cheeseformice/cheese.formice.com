<template>
  <q-page padding class="container q-pt-lg">
    <q-dialog v-model="showWork">
      <q-card>
        <q-card-section>
          <div class="text-h6">Your work</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <span v-if="emptyKeys > 0" class="text-negative">
            <q-icon name="warning" color="warning" size="1rem" />
            {{ emptyKeys }} keys have not been filled.<br />
          </span>
          <span v-if="copyState === 1" class="text-positive">
            <q-icon name="done" color="positive" size="1rem" />
            Copied to your clipboard!<br />
          </span>
          <span v-if="copyState === 2" class="text-negative">
            <q-icon name="warning" color="warning" size="1rem" />
            Could not copy the code.<br />
          </span>

          <br />
          You can send this code to any CFM administrator, along with the language name.
          <br />

          <pre style="overflow-x: auto"><code>{{ result }}</code></pre>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn outline no-caps label="Copy" color="secondary" @click="copyResult" />
          <q-btn outline no-caps label="Close" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="row q-mb-md">
      <div class="col-3">
        <q-btn
          color="secondary"
          label="Export"
          no-caps
          outline
          @click="exportTranslation()"
        />
      </div>
      <div class="col-3 col-md-5">
        <!-- Separator -->
      </div>
      <div class="col-6 col-md-4 text-right">
        <q-select
          outlined
          dense
          v-model="selectedLanguage"
          :options="validLanguages"
          :label="Language"
          :class="$q.screen.gt.sm ? 'selector' : ''"
        />
      </div>
    </div>

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
      <template #body-cell-translation="props">
        <q-td :props="props">
          <q-input
            outlined
            dense
            type="text"
            placeholder="Translation"
            v-model="props.row.translation"
          />
        </q-td>
      </template>
    </q-table>

    <div class="q-mt-md">
      <q-btn
        color="secondary"
        label="Export"
        no-caps
        outline
        @click="exportTranslation()"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Watch } from "vue-property-decorator";
import i18n from "src/i18n";
import { QTable, copyToClipboard } from "quasar";

interface TranslationFields {
  [key: string]: string | TranslationFields;
}

interface FlatTranslationField {
  key: string;
  en: string;
  translation: string;
}

interface ValidLanguage {
  label: string;
  value: string;
}

export default class Translation extends Vue {
  tableData: FlatTranslationField[] = [];
  validLanguages: ValidLanguage[] = [];
  selectedLanguage: ValidLanguage = {
    label: "No language",
    value: "",
  };
  showWork = false;
  copyState = 0;
  emptyKeys = 0;
  result = "";

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

  mounted() {
    this.tableData = this.flattenDictionary(i18n.en);

    this.validLanguages = [
      {
        label: "No language",
        value: "",
      },
      ...Object.entries(i18n).map(([code, language]) => ({
        label: language.languageName,
        value: code,
      }))
    ];
  }

  @Watch("selectedLanguage", { deep: true })
  selectLanguage() {
    if (this.selectedLanguage.value === "") {
      for (let field of this.tableData) {
        field.translation = "";
      }
      return;
    }

    const key = this.selectedLanguage.value as keyof typeof i18n;
    const language: TranslationFields = i18n[key];

    for (let field of this.tableData) {
      const access = field.key.split(".");
      let target: TranslationFields | undefined = language;

      for (let index = 0; index < access.length - 1; index++) {
        const tmp: string | TranslationFields | undefined = target[ access[index] ];

        if (tmp === undefined) {
          target = tmp;
          break;
        } else if (typeof tmp === "string") {
          target = undefined;
          break;
        }

        target = tmp;
      }

      if (!target) {
        field.translation = "";
        continue;
      }
      const translation = target[ access[ access.length - 1] ];

      if (typeof translation !== "string") {
        field.translation = "";
      } else {
        field.translation = target[ access[ access.length - 1] ] as string;
      }
    }
  }

  exportTranslation() {
    const result: TranslationFields = {};
    this.emptyKeys = 0;

    for (let field of this.tableData) {
      if (field.translation === "") {
        this.emptyKeys += 1;
        continue;
      }

      const access = field.key.split(".");
      let target: string | TranslationFields = result;

      for (let index = 0; index < access.length - 1; index++) {
        const key = access[index];
        if (!target[key]) {
          target[key] = {};
        }

        target = target[key] as TranslationFields;
      }

      target[ access[ access.length - 1] ] = field.translation;
    }

    this.result = JSON.stringify(result);
    this.showWork = true;
  }

  copyResult() {
    copyToClipboard(this.result)
      .then(() => {
        this.copyState = 1;
        setTimeout(() => {this.copyState = 0}, 1500);
      })
      .catch(() => {
        this.copyState = 2;
        setTimeout(() => {this.copyState = 0}, 1500);
      });
  }
}
</script>
