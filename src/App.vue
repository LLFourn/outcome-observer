<template>
  <v-app>
    <ribbon v-show="$router.currentRoute.path == '/'" text="Fork me on GitHub" color="#FFA500" url="https://github.com/LLFourn/outcome-observer" />
    <v-app-bar app color="primary" dark dense>
      <v-btn icon to="/">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-toolbar-title> Outcome Observer </v-toolbar-title>
      <v-spacer />
      <v-toolbar-title>
        {{ $route.params.oracle }}
      </v-toolbar-title>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
    <v-alert
      type="error"
      v-show="$root.error != null"
      transition="fade-transition"
    >
      {{ $root.error }}
    </v-alert>
  </v-app>
</template>

<script>
import Ribbon from 'vue-ribbon';
export default {
  name: "App",
  data: () => ({}),
  components: {Ribbon },
};
</script>

<style scoped>
  .json-dump { overflow: auto; }
</style>
