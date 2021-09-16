<template>
  <q-parallax :src="img" :height="225">
    <div class="container">
      <div class="row top-hero q-gutter-x-md items-center">
        <c-avatar size="128px" :id="id" :tribe="tribe" />
        <div class="tribe-shadow text-weight-medium text-white text-h3" v-if="tribe">
          {{ title }}
        </div>
        <div class="shadow text-h3 soopafresh" v-else>
          <span :class="`${namecolor} name`">{{ name }}</span>
          <span class="tag">{{ tag }}</span>
          <div class="row" v-if="cfmRoles.length + tfmRoles.length > 0">
            <q-icon
              v-for="role in cfmRoles"
              size="sm"
              :name="`mdi:${cfmBadge(role)}`"
              :key="role"
              :class="`cfm-${role} badge`"
            >
              <q-tooltip anchor="bottom middle" self="center middle">
                <span style="font-size: 0.75rem">{{ $t(`roles.cfm${role}`) }}</span>
              </q-tooltip>
            </q-icon>
            <q-badge
              v-for="role in tfmRoles"
              outline
              :class="`${role} badge tfm-badge`"
              :key="role"
              :label="$t(`roles.${role}`).toUpperCase()"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="absolute-bottom tabs">
      <div class="container">
        <q-tabs class="text-white" align="left">
          <q-route-tab v-for="tab in tabs" :key="tab.label" :label="tab.label" :to="tab.to" />
        </q-tabs>
      </div>
    </div>
  </q-parallax>
</template>

<script lang="ts">
import { Options, Prop, Vue } from "vue-property-decorator";
import { RouteLocationRaw } from "vue-router";
import { CAvatar } from "src/components";
import { CfmRole, TfmRole } from "src/api";

@Options({ components: { CAvatar } })
export default class Hero extends Vue {
  @Prop({ default: 0 }) id!: number;
  @Prop({ default: false }) tribe!: boolean;
  @Prop({ default: "" }) title!: string;
  @Prop({ default: "" }) img!: string;
  @Prop({ default: [] }) tabs!: { label: string; to: RouteLocationRaw }[];
  @Prop({ default: [] }) cfmRoles!: CfmRole[];
  @Prop({ default: [] }) tfmRoles!: TfmRole[];

  get name() {
    return this.title.split("#", 2)[0];
  }

  get tag() {
    return "#" + this.title.split("#", 2)[1];
  }

  get namecolor() {
    return this.tfmRoles.length > 0 ? this.tfmRoles[0] : "player";
  }

  cfmBadge(role: CfmRole): string {
    switch (role) {
      case "dev":
        return "shield-bug";
      case "admin":
        return "crown-circle";
      case "mod":
        return "shield-star";
      case "translator":
        return "web-plus";
    }
  }
}
</script>

<style scoped>
.top-hero {
  transform: translate(0px, -25px);
}

.avatar {
  width: 128px;
  height: 128px;
  overflow: hidden;
}

.avatar img {
  width: 134px;
  height: 134px;
  margin: -3px -3px;
}

.tribe-shadow {
  text-shadow: 0px 0px 16px black;
}

.shadow {
  text-shadow: 2px 2px 3px black, -2px 2px 3px black, -2px -2px 3px black, 2px -2px 3px black;
}

.name {
  color: rgb(var(--color));
  margin-right: 1rem;
}

.tfm-badge {
  background-color: rgba(var(--color), 0.6);
  margin-right: 0.5em;
  text-shadow: 1px 1px 2px black, -1px 1px 2px black, -1px -1px 2px black, 1px -1px 2px black !important;
}

.badge {
  color: rgb(var(--color));
  margin-right: 0.25em;
  text-shadow: 0px 0px 10px black;
}

.cfm-translator {
  --color: 204, 79, 242;
}

.cfm-mod {
  --color: 215, 232, 42;
}

.cfm-admin {
  --color: 235, 29, 81;
}

.cfm-dev {
  --color: 235, 29, 81;
}

.player {
  --color: 0, 157, 157;
}

.fashion {
  --color: 239, 152, 170;
}

.funcorp {
  --color: 248, 159, 75;
}

.module {
  --color: 122, 201, 196;
}

.mapcrew {
  --color: 46, 114, 203;
}

.sentinel {
  --color: 48, 186, 118;
}

.mod {
  --color: 186, 189, 47;
}

.admin {
  --color: 235, 29, 81;
}

.tag {
  color: #60608f;
  font-size: 0.75em;
}

.tabs {
  background-color: rgba(0, 0, 0, 0.75);
}
</style>
