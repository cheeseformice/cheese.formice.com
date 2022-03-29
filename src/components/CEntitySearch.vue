<template>
  <q-select
    v-model="selectedSearch"
    :placeholder="$t('search')"
    outlined
    dense
    :model-value="content"
    @input-value="setContent"
    :color="color"
    :dark="color === 'white'"
    use-input
    hide-selected
    fill-input
    options-dense
    input-debounce="500"
    ref="itemSelection"
    :options="searchResult"
    @filter="search"
    @keyup.enter="onSearchSelect"
  >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey"> No results </q-item-section>
      </q-item>
    </template>
    <template #option="scope">
      <q-item v-bind="scope.itemProps" clickable v-ripple @click="onSelect(scope.opt)">
        <q-item-section avatar>
          <c-avatar :id="scope.opt.id" :tribe="scope.opt.type === 'tribe'" />
        </q-item-section>
        <q-item-section>{{ scope.opt.name }}</q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script lang="ts">
import { mixins, Prop } from "vue-property-decorator";
import { RouteLocationRaw } from "vue-router";
import { CfmRole, TfmRole, PlayersService, TribesService } from "src/api";
import { Images } from "src/common/mixins";

interface Entity {
  label: string;
  type: string;
  id: number;
  name: string;
  cfmRoles?: CfmRole[];
  tfmRoles?: TfmRole[];
}

export interface SearchOption extends Entity {
  route: RouteLocationRaw;
}

export const NullSearchOption = <SearchOption>{
  label: "",
  type: "player",
  id: 0,
  name: "Null#0001",
  cfmRoles: [],
  tfmRoles: [],
  route: {
    name: "player",
    params: { playerName: "Null#0001" },
  },
};

export default class CEntitySearch extends mixins(Images) {
  @Prop({ required: true }) players!: boolean;
  @Prop({ required: true }) tribes!: boolean;
  @Prop({ required: true }) onSelect!: (e: SearchOption) => unknown;
  @Prop({ required: false }) onTyped?: (e: string) => unknown;
  @Prop({ default: "white" }) color!: string;

  selectedSearch: SearchOption | null = null;
  searchResult: SearchOption[] = [];
  content = "";

  async search(keyword: string, update: (v: unknown) => void) {
    if (!keyword)
      return update(() => {
        /* Empty function just so the popup shows again */
      });
    const promises = [];

    if (this.players) {
      promises.push(PlayersService.search({ search: keyword }));
    }
    if (this.tribes) {
      promises.push(TribesService.search({ search: keyword }));
    }

    const response = await Promise.all(promises);
    const results: Entity[] = [];

    if (this.players) {
      results.push(...response[0].data.page.map((p) => ({ ...p, label: p.name, type: "player" })));
    }
    if (this.tribes) {
      const i = response.length - 1;
      results.push(...response[i].data.page.map((t) => ({ ...t, label: t.name, type: "tribe" })));
    }

    update(() => {
      this.searchResult = results.map((r) => {
        const isPlayer = r.type === "player";
        return {
          ...r,
          route: {
            name: isPlayer ? "player" : "tribe",
            params: { playerName: r.name, tribeName: r.name },
          },
        };
      });
    });
  }

  onSearchSelect() {
    if (!this.selectedSearch) {
      if (this.onTyped) this.onTyped(this.content);
      return;
    }
    this.onSelect(this.selectedSearch);
  }

  setContent(value: string) {
    this.content = value;
  }
}
</script>
