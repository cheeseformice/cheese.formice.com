<template>
  <q-page padding class="container q-pt-lg">
    <q-dialog v-model="showWork">
      <q-card class="bg-contrast">
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

    <q-dialog v-model="showImport">
      <q-card class="bg-contrast">
        <q-card-section>
          <div class="text-h6">Import translations</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            outlined
            dense
            :dark="$dark.enabled"
            v-model="importInput"
            type="text"
            placeholder="Exported translation"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn outline no-caps label="Import" color="secondary" @click="importTranslation()" />
          <q-btn outline no-caps label="Cancel" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="row q-mb-md">
      <div class="col-3">
        <q-btn
          color="secondary"
          label="Export"
          class="q-mr-md"
          no-caps
          outline
          @click="exportTranslation()"
        />
        <q-btn color="secondary" label="Import" no-caps outline @click="showImport = true" />
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
          :label="$t('language')"
          :class="$q.screen.gt.sm ? 'selector' : ''"
          :dark="$dark.enabled"
          options-selected-class="text-contrast"
          standout="text-contrast"
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
      class="bg-contrast text-contrast"
    >
      <template #body-cell-key="props">
        <q-td :props="props">
          <code>{{ props.value }}</code>
        </q-td>
      </template>
      <template #body-cell-en="props">
        <q-td :props="props">
          <span v-if="props.value.length < 35">{{ props.value }}</span>
          <div v-else>
            <q-btn
              color="secondary"
              label="View"
              no-caps
              outline
              @click="viewField(props.row.key)"
            />
            <q-dialog v-model="props.row.view">
              <q-card class="bg-contrast">
                <q-card-section>
                  <div class="text-h6">Translation</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <span v-if="!isValidHTML(props.row.translation)" class="text-negative">
                    <q-icon name="warning" color="warning" size="1rem" />
                    Invalid translation<br /><br />
                  </span>

                  <pre><code
                    style="white-space: break-spaces;"
                    v-html="visualizeHTML(props.value)"
                  ></code></pre>

                  <q-input
                    outlined
                    dense
                    :dark="$dark.enabled"
                    type="textarea"
                    placeholder="Translation"
                    v-model="props.row.translation"
                  />
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn outline no-caps label="Close" color="secondary" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
        </q-td>
      </template>
      <template #body-cell-translation="props">
        <q-td :props="props">
          <q-input
            outlined
            dense
            type="text"
            placeholder="Translation"
            :dark="$dark.enabled"
            :input-class="props.row.translation.length === 0 ? 'text-negative' : ''"
            v-model="props.row.translation"
            v-if="props.row.en.length < 35"
          />
          <div v-else>
            <span v-if="props.row.translation.length > 0">
              <span class="text-positive" v-if="isValidHTML(props.row.translation)">
                Already translated
              </span>
              <span class="text-negative" v-else> Invalid translation </span>
            </span>
            <span class="text-negative" v-else> Missing translation </span>
          </div>
        </q-td>
      </template>
    </q-table>

    <div class="q-mt-md">
      <q-btn color="secondary" label="Export" no-caps outline @click="exportTranslation()" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Watch } from "vue-property-decorator";
import i18n from "src/i18n";
import { QTable, copyToClipboard } from "quasar";
import Auth from "src/auth";
import { AuthState } from "src/auth/interfaces";

interface TranslationFields {
  [key: string]: string | TranslationFields;
}

interface FlatTranslationField {
  key: string;
  view: boolean;
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
  showImport = false;
  copyState = 0;
  emptyKeys = 0;
  importInput = "";
  result = "";

  hook = -1;

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
      if (key === "__isoCode") {
        continue;
      }

      if (typeof value === "string") {
        data.push({
          key,
          view: false,
          en: value,
          translation: "",
        });
      } else {
        const child = this.flattenDictionary(value);

        for (let index = 0; index < child.length; index++) {
          const { key: _key, en, translation } = child[index];
          data.push({
            key: `${key}.${_key}`,
            view: false,
            en,
            translation,
          });
        }
      }
    }

    return data;
  }

  viewField(key: string) {
    for (let field of this.tableData) {
      if (field.key === key) {
        field.view = true;
        return;
      }
    }
  }

  visualizeHTML(html: string): string {
    return html.replace(/</g, "&lt;").replace(/&lt;br>/g, "<br>");
  }

  isValidHTML(html: string): boolean {
    var doc = document.createElement("div");
    doc.innerHTML = html;
    return doc.innerHTML === html.replace(/&/g, "&amp;");
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
      })),
    ];

    this.hook = Auth.hook(
      { player: { cfmRoles: ["translator", "admin", "dev"] } },
      {
        mismatch: (state: AuthState) => {
          if (!state.logged) {
            void this.$router.replace({ name: "login" });
          } else {
            void this.$router.replace({ name: "account" });
          }
        },
      },
      ["player.cfmRoles"]
    );
  }

  unmounted() {
    Auth.unhook(this.hook);
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
        const tmp: string | TranslationFields | undefined = target[access[index]];

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
      const translation = target[access[access.length - 1]];

      if (typeof translation !== "string") {
        field.translation = "";
      } else {
        field.translation = target[access[access.length - 1]] as string;
      }
    }
  }

  importTranslation() {
    const fields: TranslationFields = JSON.parse(this.importInput) as TranslationFields;

    for (let field of this.tableData) {
      const access = field.key.split(".");
      let target: null | TranslationFields = fields;

      for (let index = 0; index < access.length - 1; index++) {
        const key = access[index];
        if (!target[key] || typeof target === "string") {
          target = null;
          break;
        }

        target = target[key] as TranslationFields;
      }

      if (target === null) {
        field.translation = "";
        continue;
      }

      const text = target[access[access.length - 1]];
      if (typeof text !== "string") {
        field.translation = "";
      } else {
        field.translation = text.replace(/<br>/g, "\n");
      }
    }

    this.showImport = false;
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
      let target: TranslationFields = result;

      for (let index = 0; index < access.length - 1; index++) {
        const key = access[index];
        if (!target[key]) {
          target[key] = {};
        }

        target = target[key] as TranslationFields;
      }

      target[access[access.length - 1]] = field.translation.replace(/\n/g, "<br>");
    }

    this.result = JSON.stringify(result);
    this.showWork = true;
  }

  async copyResult() {
    try {
      await copyToClipboard(this.result);
      this.copyState = 1;
      await new Promise((r) => setTimeout(r, 1500));
      this.copyState = 0;
    } catch (err) {
      this.copyState = 2;
      await new Promise((r) => setTimeout(r, 1500));
      this.copyState = 0;
    }
  }
}
</script>
