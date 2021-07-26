<template>
  <v-container>
    <v-row>
      <v-col class="text-center">
        <router-breadcrumbs></router-breadcrumbs>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col>
        <p v-html="$describe.path_html($route.params.path)"></p>
      </v-col>
    </v-row>
    <v-row v-show="in_progress" justify="center">
      <v-col cols="1">
        <v-progress-circular indeterminate />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="event_kind in events"
        cols="12"
        sm="6"
        :key="`${event_kind}-card`"
      >
        <event-card
          :event="eventId(event_kind)"
          :oracle="$route.params.oracle"
          :key="event_kind"
          @mouseover="$root.child_selected = '.' + event_kind"
          @mouseleave="$root.child_selected = null"
        />
      </v-col>
      <v-col>
        <child-picker
          :children="children"
          :oracle="$route.params.oracle"
          :path="$route.params.path"
          @selected="
            $root.child_selected = $event != null ? '/' + $event : null
          "
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script type="text/javascript">
import axios from "axios";
import ChildPicker from "../components/ChildPicker";
import EventCard from "../components/EventCard";
import RouterBreadcrumbs from "../components/RouterBreadcrumbs";

export default {
  name: "OraclePath",
  created: async function () {
    this.updateData(this.$route.params.oracle, this.$route.params.path);
  },
  data() {
    return {
      children: null,
      events: [],
      next_selection: null,
      in_progress: false,
    };
  },
  methods: {
    eventId(event_kind) {
      return this.$route.params.path + "." + event_kind;
    },
    updateData: async function (oracle, path) {
      this.children = null;
      this.events = null;
      this.in_progress = true;
      let url = "https://" + oracle + path;
      try {
        let res = await axios(url);
        this.in_progress = false;
        this.children = res.data.children;
        this.events = res.data.events;
      } catch (e) {
        this.$root.set_error(`could not fetch from ${url} (${e})`);
      } finally {
        this.in_progress = false;
      }
    },
  },
  beforeRouteUpdate(to, from, next) {
    if (to.name == "oracle-path") {
      this.updateData(to.params.oracle, to.params.path);
    }
    next();
  },
  computed: {
    childrenEmpty() {
      let c = this.children;
      return c == null || (c.kind == "list" && c.list.length == 0);
    },
    breadcrumbs() {
      let items = this.$route.params.path.substr(1).split("/");
      let oracle = this.$route.params.oracle;
      let breadcrumbs = [{ text: oracle, href: "/" + oracle, divider: "" }];
      items.forEach((text) =>
        breadcrumbs.push({
          text,
          href: breadcrumbs[breadcrumbs.length - 1].href + "/" + text,
        })
      );
      delete breadcrumbs[breadcrumbs.length - 1].href;
      return breadcrumbs;
    },
  },
  components: { ChildPicker, EventCard, RouterBreadcrumbs },
};
</script>
