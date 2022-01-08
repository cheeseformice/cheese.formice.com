<template>
  <div>
    <q-dialog v-model="showError">
      <q-card class="bg-contrast">
        <q-card-section>
          <div class="text-h6">{{ $t("error") }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <span class="text-negative">
            <q-icon name="warning" color="warning" size="1rem" />
            {{ error }}<br />
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn outline no-caps label="Close" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <h5 class="q-my-none">{{ $t("rightsManagement") }}</h5>
    <q-separator spaced />
    <div>
      <c-entity-search
        :players="true"
        :tribes="false"
        :color="$dark.enabled ? 'white' : 'black'"
        :onSelect="selectPlayer"
      />

      <div class="q-mb-sm" v-if="player.id > 0"></div>
      <q-card flat bordered v-if="player.id > 0" class="bg-contrast">
        <q-item>
          <q-item-section avatar>
            <q-avatar square>
              <img :src="getAvatar(player.id || 0, false, false)" />
            </q-avatar>
          </q-item-section>

          <q-separator vertical size="2px" />

          <q-item-section class="q-ml-md">
            <q-item-label class="text-h6">{{ player.name }}</q-item-label>
            <q-item-label>
              <q-badge
                v-for="role in player.cfmRoles || []"
                outline
                class="q-mr-sm cursor-pointer"
                :class="'cfm-' + role"
                :key="'cfm-' + role"
                :label="'cfm-' + role"
                @click="void removeRole(role)"
              />
              <q-btn-dropdown
                content-class="bg-contrast"
                flat
                class="q-pa-none text-contrast"
                style="height: auto; min-height: 0"
              >
                <q-list>
                  <q-item
                    clickable
                    v-close-popup
                    v-for="role in availableRoles"
                    :key="role"
                    class="q-pa-sm"
                    @click="void addRole(role)"
                  >
                    <q-item-section>
                      <q-item-label>{{ role }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-item-label>
            <q-item-label>
              <q-badge
                v-for="role in player.tfmRoles || []"
                outline
                class="q-mr-sm text-contrast"
                :key="role"
                :label="role"
              />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card>
    </div>

    <h5 class="q-mb-none">{{ $t("privilegedPlayers") }}</h5>
    <q-separator spaced />
    <div class="row col-12">
      <q-card
        flat
        bordered
        v-for="player in privilegedPlayers"
        :key="player.id"
        class="bg-contrast col-lg-4 col-md-6 col-12"
      >
        <q-item>
          <q-item-section avatar>
            <q-avatar square>
              <img :src="getAvatar(player.id || 0, false, false)" />
            </q-avatar>
          </q-item-section>

          <q-separator vertical size="2px" />

          <q-item-section class="q-ml-md">
            <q-item-label class="text-h6">{{ player.name }}</q-item-label>
            <q-item-label>
              <q-badge
                v-for="role in player.cfmRoles || []"
                outline
                class="q-mr-sm cursor-pointer"
                :class="'cfm-' + role"
                :key="'cfm-' + role"
                :label="'cfm-' + role"
                @click="void removeRole(role)"
              />
              <q-btn-dropdown
                content-class="bg-contrast"
                flat
                class="q-pa-none text-contrast"
                style="height: auto; min-height: 0"
              >
                <q-list>
                  <q-item
                    clickable
                    v-close-popup
                    v-for="role in availableRoles"
                    :key="role"
                    class="q-pa-sm"
                    @click="void addRole(role)"
                  >
                    <q-item-section>
                      <q-item-label>{{ role }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-item-label>
            <q-item-label>
              <q-badge
                v-for="role in player.tfmRoles || []"
                outline
                class="q-mr-sm text-contrast"
                :key="role"
                :label="role"
              />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cfm-translator {
  color: rgb(204, 79, 242);
}

.cfm-mod {
  color: rgb(215, 232, 42);
}

.cfm-admin {
  color: rgb(235, 29, 81);
}

.cfm-dev {
  color: rgb(235, 29, 81);
}
</style>

<script lang="ts">
import { BasePlayer, CfmRole, TfmRole } from "src/api";
import { mixins } from "vue-property-decorator";
import { Images } from "src/common/mixins";
import { RouteLocationRaw } from "vue-router";
import Auth from "src/auth";

// If we import these interfaces from CEntitySearch.vue, eslint gets bugged lol
interface Entity {
  label: string;
  type: string;
  id: number;
  name: string;
  cfmRoles?: CfmRole[];
  tfmRoles?: TfmRole[];
}

interface SearchOption extends Entity {
  route: RouteLocationRaw;
}

const NullSearchOption = <SearchOption>{
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

export default class UserInfo extends mixins(Images) {
  player: SearchOption = NullSearchOption;

  showError = false;
  error = "";

  availableRoles: CfmRole[] = ["dev", "admin", "mod", "translator"];
  privilegedPlayers: BasePlayer[] = [];

  selectPlayer(player: SearchOption) {
    this.player = player;
  }

  async sendNewRoles(): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const result = await Auth.admin.updateRoles(this.player.name, this.player.cfmRoles!);
    if (result === undefined) {
      return true;
    }

    this.showError = true;
    this.error = result;
    return false;
  }

  async fetchPrivilegedPlayers() {
    const result = await Auth.admin.getPrivilegedPlayers();
    if (typeof result === "string") {
      this.showError = true;
      this.error = result;
      return;
    }

    this.privilegedPlayers = result;
  }

  async addRole(role: CfmRole, dontUpdate?: boolean) {
    if (this.player.cfmRoles) {
      this.player.cfmRoles.push(role);
    } else {
      this.player.cfmRoles = [role];
    }

    if (!dontUpdate) {
      if (!(await this.sendNewRoles())) {
        // unsucessful to add role, remove it locally
        await this.removeRole(role, true);
      } else {
        await this.fetchPrivilegedPlayers();
      }
    }
  }

  async removeRole(role: CfmRole, dontUpdate?: boolean) {
    if (!this.player.cfmRoles) {
      return;
    }

    const index = this.player.cfmRoles.indexOf(role);
    if (index > -1) {
      this.player.cfmRoles.splice(index, 1);
    }

    if (!dontUpdate) {
      if (!(await this.sendNewRoles())) {
        // unsucessful to remove role, add it locally
        await this.addRole(role, true);
      } else {
        await this.fetchPrivilegedPlayers();
      }
    }
  }

  mounted() {
    void this.fetchPrivilegedPlayers();
  }
}
</script>
