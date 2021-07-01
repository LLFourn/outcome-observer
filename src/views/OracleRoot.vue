<template>
  <v-container align="center">
    <breadcrumbs
      :items="[{ text: $route.params.oracle, divider: '' }]"
      :next_selection="next_selection"
    />
    <pre> {{ keys }} </pre>
    <child-picker
      :children="children"
      :oracle="$route.params.oracle"
      path="/"
      @selected="next_selection = $event != null ? '/' + $event : null"
    />
  </v-container>
</template>

<script type="text/javascript">
import axios from "axios";
import ChildPicker from "../components/ChildPicker";
import Breadcrumbs from "../components/Breadcrumbs";

export default {
  name: "OracleRoot",
  created: async function () {
    let oracle = this.$route.params.oracle;
    let res = await axios("https://" + oracle);
    let oracle_info = res.data;
    this.children = oracle_info.children;
    this.keys = {
      announcement_key: oracle_info.announcement_key,
      attestation_key: oracle_info.attestation_key,
    };
  },
  data: () => ({
    children: null,
    keys: null,
    next_selection: null,
  }),
  components: { ChildPicker, Breadcrumbs },
};
</script>
