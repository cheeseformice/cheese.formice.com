<template>
  <div
    ref="panel"
    class="window-height q-pa-md fixed z-top sidebar"
    @click="showLinks = !showLinks"
  >
    <div v-if="!$q.screen.xs || showLinks">
      <c-link-section
        v-for="section of sections"
        :key="section.label"
        dark
        :contrast="false"
        :label="section.label"
        :links="section.links"
      />
    </div>
    <div ref="mobileDrawer" class="absolute-center" v-else>
      <q-icon name="chevron_right" size="md" />
    </div>
  </div>
  <div ref="content" class="q-pa-md full-height">
    <slot></slot>
  </div>
</template>

<style scoped>
.sidebar {
  background-color: #292929;
  color: #d5d5d5;
}
</style>

<script lang="ts">
import { Vue, Prop, Ref, Options } from "vue-property-decorator";
import { CLinkSection } from "src/components";

interface Link {
  label: string;
  to: { name: string; params?: Record<string, string> };
}

interface Section {
  label?: string;
  links: Link[];
}

interface TouchEventHandler {
  (evt: TouchEvent): void;
}

@Options({
  components: { CLinkSection },
})
export default class SidePanel extends Vue {
  @Prop({ required: true }) sections!: Section[];

  @Ref() readonly panel!: HTMLDivElement;
  @Ref() readonly content!: HTMLDivElement;
  @Ref() readonly mobileDrawer!: HTMLDivElement;

  observer?: ResizeObserver;
  xDown?: number;
  yDown?: number;

  showLinks = false;

  onTouchStart?: TouchEventHandler;
  onTouchEnd?: TouchEventHandler;

  onResize(forced?: boolean) {
    if (!forced && this.showLinks) {
      return;
    }
    this.content.style.marginLeft = `${this.panel.offsetWidth}px`;
  }

  _onTouchStart(evt: TouchEvent) {
    this.xDown = evt.touches[0].clientX;
    this.yDown = evt.touches[0].clientY;
  }

  _onTouchEnd(evt: TouchEvent) {
    if (!this.$q.screen.xs) {
      return;
    }
    if (!this.xDown || !this.yDown) {
      return;
    }

    const maxDistance = 1 / 4;
    if (this.showLinks) {
      if (this.xDown < this.$q.screen.width * (1 - maxDistance)) {
        return;
      }
    } else {
      if (this.xDown > this.$q.screen.width * maxDistance) {
        return;
      }
    }

    const xDiff = this.xDown - evt.touches[0].clientX;
    const yDiff = this.yDown - evt.touches[0].clientY;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      // most significant move is horizontal
      if (Math.abs(xDiff) < this.$q.screen.width / 3) {
        return;
      } // not too much of a move

      if (xDiff < 0) {
        this.showLinks = true;
      } else {
        this.showLinks = false;
      }
    }
  }

  mounted() {
    this.onTouchStart = this._onTouchStart.bind(this);
    this.onTouchEnd = this._onTouchEnd.bind(this);

    document.addEventListener("touchstart", this.onTouchStart);
    document.addEventListener("touchmove", this.onTouchEnd);

    if (!this.observer) {
      this.observer = new ResizeObserver(() => this.onResize());
    } else {
      this.observer.unobserve(this.panel);
    }
    this.observer.observe(this.panel);
    this.onResize(true);
  }

  beforeUnmount() {
    if (!!this.onTouchStart) document.removeEventListener("touchstart", this.onTouchStart);
    if (!!this.onTouchEnd) document.removeEventListener("touchend", this.onTouchEnd);
    this.observer?.unobserve(this.panel);
  }
}
</script>
