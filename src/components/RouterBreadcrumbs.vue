<template>
  <span class="display-1">
    <v-btn icon exact outlined class="breadcrumb-up" :to="upDir">
      <v-icon large>mdi-arrow-up</v-icon>
    </v-btn>

    <breadcrumbs
      :items="$root.breadcrumbs"
      :next_selection="$root.child_selected"
    >
      <slot> </slot>
    </breadcrumbs>
  </span>
</template>

<script>
import Breadcrumbs from "./Breadcrumbs";

export default {
  name: "RouterBreadcrumbs",
  created() {
    this.$root.child_selected = null;
  },
  watch: {
    $route: function () {
      this.$root.child_selected = null;
    },
  },
  computed: {
    upDir() {
      return (
        this.$root.breadcrumbs
          .slice()
          ?.reverse()
          .find((item) => item.href != null)?.href || "/"
      );
    },
  },
  components: { Breadcrumbs },
};
</script>

<style scoped>
.breadcrumb-up {
  margin-right: 10px;
}
</style>
