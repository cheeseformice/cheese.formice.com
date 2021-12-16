<template>
  <div class="row">
    <q-card flat bordered class="col-12 bg-contrast">
      <q-item clickable @click="dropdown(servicesDropdown)">
        <q-item-section>
          <q-item-label class="text-left text-h6">
            <div class="row">
              <div class="col-auto">API services</div>
              <div class="col">
                <q-icon name="help_outline" size="1rem" class="q-ml-sm text-contrast">
                  <q-tooltip
                    anchor="top middle"
                    content-style="font-size: 1rem;"
                    self="center middle"
                  >
                    {{ $t("help.api") }}
                  </q-tooltip>
                </q-icon>
              </div>
            </div>
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-right" :class="statusClass[apiStatus]">
            {{ $t(`status.${apiStatus}`) }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <div ref="servicesDropdown" class="hidden">
        <q-item v-for="service in services" :key="service">
          <q-item-section class="q-pl-md text-left">
            <div class="row">
              <div class="col-auto">
                {{ capitalize(service) }}
              </div>
              <div class="col" v-if="$te(`help.${service}`)">
                <q-icon name="help_outline" size="1em" class="q-ml-sm text-contrast">
                  <q-tooltip
                    anchor="top middle"
                    content-style="font-size: 1rem;"
                    self="center middle"
                  >
                    {{ $t(`help.${service}`) }}
                  </q-tooltip>
                </q-icon>
              </div>
            </div>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-right" :class="statusClass[status[service]]">
              {{ $t(`status.${status[service]}`) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-card>
  </div>
</template>

<script lang="ts">
import { Prop, Ref, Vue } from "vue-property-decorator";
import { HealthcheckReport, HealthcheckService, ServiceReport } from "src/api";

type ServiceStatus = "operational" | "partialOutage" | "majorOutage";

export default class CurrentServerStatus extends Vue {
  @Prop({}) services!: string[];
  @Prop({}) startHidden!: boolean[];

  @Ref() readonly servicesDropdown!: HTMLDivElement;

  statusClass: Record<ServiceStatus, string> = {
    operational: "text-positive",
    partialOutage: "text-warning",
    majorOutage: "text-negative",
  };
  status: Record<string, ServiceStatus> = {};
  websocketListener?: number;

  get apiStatus(): ServiceStatus {
    let partial = 0,
      major = 0;

    for (let service of this.services) {
      const serviceStatus = this.status[service];

      if (serviceStatus === "partialOutage") {
        partial += 1;
      } else if (serviceStatus === "majorOutage") {
        major += 1;
      }
    }

    if (major === 0) {
      if (partial === 0) {
        return "operational";
      }
      return "partialOutage";
    }
    return "majorOutage";
  }

  writeServiceStatus(service: string, status: ServiceReport | null) {
    if (status === null) {
      this.status[service] = "majorOutage";
    } else {
      this.status[service] = "operational";
    }
  }

  writeAPIStatus(status: HealthcheckReport) {
    this.status = {};
    for (let service of this.services) {
      this.writeServiceStatus(service, status[service]);
    }

    for (let service of Object.keys(status)) {
      this.writeServiceStatus(service, status[service]);
    }
  }

  dropdown(element: HTMLDivElement) {
    element.classList.toggle("hidden");
  }

  capitalize(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  mounted() {
    if (!this.startHidden) {
      this.dropdown(this.servicesDropdown);
    }

    void this.fetchStatus();
  }

  unmounted() {
    if (this.websocketListener) {
      // ids start at 1 so no problem in checking as bool
      HealthcheckService.removeListener(this.websocketListener);
      this.websocketListener = undefined;
    }
  }

  async fetchStatus() {
    this.writeAPIStatus(await HealthcheckService.getCurrentStatus());

    if (!this.websocketListener) {
      this.websocketListener = HealthcheckService.addListener(this.writeAPIStatus.bind(this));
    }
  }
}
</script>
