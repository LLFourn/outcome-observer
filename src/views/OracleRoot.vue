<template>
  <v-container>
    <v-row>
      <v-col class="text-center">
        <router-breadcrumbs></router-breadcrumbs>
      </v-col>
    </v-row>
    <v-row v-show="in_progress" justify="center">
      <v-col cols="1">
        <v-progress-circular indeterminate />
      </v-col>
    </v-row>
    <v-row v-show="children">
      <v-col>
        <child-picker
          :children="children"
          :oracle="$route.params.oracle"
          path="/"
          @selected="
            $root.child_selected = $event != null ? '/' + $event : null
          "
        />
      </v-col>
    </v-row>
    <v-row v-show="keys">
      <v-expansion-panels popout multiple>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <v-row justify="center"
              ><v-col cols="6" class="text-center"> Public keys </v-col></v-row
            ></v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <pre>{{ JSON.stringify(keys, null, "\t") }}</pre>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </v-container>
</template>

<script type="text/javascript">
import axios from "axios";
import ChildPicker from "../components/ChildPicker";
import RouterBreadcrumbs from "../components/RouterBreadcrumbs";

export default {
  name: "OracleRoot",
  created: async function () {
    let oracle = this.$route.params.oracle;
    let url = "https://" + oracle;
    this.in_progress = true;
    try {
      let res = await axios(url);
      let oracle_info = res.data;
      this.children = oracle_info.children;
      this.keys = {
        announcement_key: oracle_info.announcement_key,
        attestation_key: oracle_info.attestation_key,
      };
    } catch (e) {
      this.$root.set_error(`could not make request from ${url} (${e})`);
    } finally {
      this.in_progress = false;
    }
  },
  data: () => ({
    children: null,
    keys: null,
  }),
  components: { ChildPicker, RouterBreadcrumbs },
};
</script>
