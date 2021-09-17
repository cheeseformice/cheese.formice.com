<script lang="ts">
import { Vue } from "vue-property-decorator";

export default class Tools extends Vue {
  mounted() {
    if (this.$route.name == "tools") {
      // if no tool is selected, go back to home
      void this.$router.push({ name: "home" });
      return;
    }
  }
}
</script>
