<template>
  <div>
    <q-dialog v-model="showSanction">
      <q-card v-if="!!sanction">
        <q-card-section>
          <div class="text-h6">Sanction</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-table
            grid
            :rows="[sanction]"
            :columns="expandedColumns"
            row-key="subject"
            hide-header
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn outline no-caps label="Close" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <h5 class="q-my-none">Sanction Information</h5>
    <q-separator spaced />
    <div>
      <q-table title="Sanctions" dense :rows="rows" :columns="columns" row-key="subject">
        <template v-slot:top>
          <q-icon name="warning" color="warning" size="1rem" />
          All dates are in your local time.
          <q-space />
          <c-entity-search :players="true" :tribes="true" color="black" :onSelect="selectSubject" />
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn size="sm" color="secondary" round dense @click="showInfo(props.row)">?</q-btn>
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script lang="ts">
import { BasePlayer } from "src/api";
import { Vue } from "vue-property-decorator";

type SanctionType = "hacking";
type AppealStatus = "available" | "not_available" | "open" | "closed";

interface Subject extends BasePlayer {
  type: "player" | "tribe";
}

interface Sanction {
  mod: BasePlayer;
  type: SanctionType;
  reason?: string;
  date: Date;
}

interface Cancellation {
  mod: BasePlayer;
  reason?: string;
  date: Date;
}

interface Appeal {
  status: AppealStatus;
  messages: number;
}

interface Container {
  id: number;
  subject: Subject;
  sanction: Sanction;
  cancellation?: Cancellation;
  appeal: Appeal;
}

export default class SanctionInfo extends Vue {
  showSanction = false;
  sanction?: Container;

  get columns() {
    return [
      {},
      {
        name: "subject",
        label: "Subject",
        align: "left",
        field: (container: Container) => container.subject.name,
      },
      {
        name: "type",
        label: "Type",
        align: "left",
        field: (container: Container) => container.sanction.type,
      },
      {
        name: "date",
        label: "Date",
        align: "left",
        field: (container: Container) => container.sanction.date.toLocaleString(),
      },
      {
        name: "cancelled",
        label: "Cancelled",
        align: "left",
        field: (container: Container) => (!!container.cancellation ? "yes" : "no"),
      },
    ];
  }

  get expandedColumns() {
    return [
      ...this.columns.slice(1),
      {
        name: "mod",
        label: "Moderator",
        align: "left",
        field: (container: Container) => container.sanction.mod.name,
      },
      {
        name: "reason",
        label: "Reason",
        align: "left",
        field: (container: Container) => container.sanction.reason,
      },
      {
        name: "appeal-status",
        label: "Appeal Status",
        align: "left",
        field: (container: Container) => {
          const status = container.appeal.status;
          if (status == "open" || status == "closed") {
            return `${status} (${container.appeal.messages} messages)`;
          }
          return status;
        },
      },
      {
        name: "canceller",
        label: "Canceller",
        align: "left",
        field: (container: Container) => container.cancellation?.mod.name || "-",
      },
      {
        name: "cancellation-reason",
        label: "Cancellation Reason",
        align: "left",
        field: (container: Container) => container.cancellation?.reason || "-",
      },
      {
        name: "cancellation-date",
        label: "Cancellation Date",
        align: "left",
        field: (container: Container) => container.cancellation?.date.toLocaleString() || "-",
      },
    ];
  }

  get rows(): Container[] {
    return [
      {
        id: 0,
        subject: {
          type: "player",
          id: 69764473,
          name: "Syrius#8114",
          cfmRoles: ["admin"],
          tfmRoles: [],
        },
        sanction: {
          mod: {
            id: 51058033,
            name: "Tocutoeltuco#0000",
            cfmRoles: ["dev"],
            tfmRoles: ["module"],
          },
          type: "hacking",
          reason: "loser",
          date: new Date(),
        },
        appeal: {
          status: "available",
          messages: 0,
        },
      },
      {
        id: 0,
        subject: {
          type: "player",
          id: 104811761,
          name: "Callmoo#1963",
          cfmRoles: ["dev"],
          tfmRoles: [],
        },
        sanction: {
          mod: {
            id: 51058033,
            name: "Tocutoeltuco#0000",
            cfmRoles: ["dev"],
            tfmRoles: ["module"],
          },
          type: "hacking",
          reason: "loser²",
          date: new Date(),
        },
        cancellation: {
          mod: {
            id: 69764473,
            name: "Syrius#8114",
            cfmRoles: ["admin"],
            tfmRoles: [],
          },
          reason: "not a loser",
          date: new Date(),
        },
        appeal: {
          status: "closed",
          messages: 5,
        },
      },
    ];
  }

  showInfo(sanction: Container) {
    this.showSanction = true;
    this.sanction = sanction;
  }

  selectSubject(subject: any) {
    return;
  }
}
</script>
