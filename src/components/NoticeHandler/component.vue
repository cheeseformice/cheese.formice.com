<template>
  <div v-bind:key="idx" class="z-max notice" :type="notice.type" v-for="(notice, idx) in notices">
    <div class="container q-pl-md text-white full-height self-stretch">
      <q-icon :name="getNoticeIcon(notice.type)" size="1rem" class="q-pr-sm" />
      {{ $t(notice.text) }}

      <q-space />
      <q-icon
        name="close"
        size="1rem"
        class="q-mr-sm cursor-pointer"
        @click="controller.closeNotice(idx)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notice {
  height: 50px;
}
.notice[type="info"] {
  background-color: #292929;
}
.notice[type="error"] {
  background-color: #e91e63;
}

.notice .container {
  display: flex;
  align-content: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
}
</style>

<script lang="ts">
import { Vue } from "vue-class-component";
import { Notice, NoticeController, controller } from "./controller";

export default class NoticeHandler extends Vue {
  public notices: Notice[] = [];
  controller: NoticeController = controller.setNoticesCallback(this.updateNotices.bind(this));

  updateNotices(action: "close" | "add", idx?: number): void {
    if (action == "close") {
      this.notices.splice(idx as number, 1);
    } else {
      this.notices.push(this.controller.notices[this.controller.notices.length - 1]);
    }
  }

  getNoticeIcon(type: string): string {
    switch (type) {
      case "error":
        return "warning";

      case "info":
      default:
        return "info";
    }
  }
}
</script>
