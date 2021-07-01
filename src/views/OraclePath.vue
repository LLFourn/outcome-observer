<template>
  <v-container>
    <v-row>
      <v-col>
        <breadcrumbs :items="breadcrumbs" :next_selection="next_selection" />
        <p v-html="$describe.path_long('/' + $route.params.path)"></p>
        <v-row>
          <v-col v-show="in_progress"
            ><v-progress-circular indeterminate
          /></v-col>
          <v-col v-for="event_kind in events" cols="6">
            <event-card
              :event="eventId(event_kind)"
              :oracle="$route.params.oracle"
              :key="event_kind"
              @mouseover="next_selection = '.' + event_kind"
              @mouseleave="next_selection = null"
            />
          </v-col>
          <v-col>
            <child-picker
              :children="children"
              :oracle="$route.params.oracle"
              :path="$route.params.path"
              @selected="next_selection = $event != null ? '/' + $event : null"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script type="text/javascript">
import axios from "axios";
import ChildPicker from "../components/ChildPicker";
import EventCard from "../components/EventCard";
import Breadcrumbs from "../components/Breadcrumbs";

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
      this.next_selection = null;
      this.in_progress = true;
      let res = await axios("https://" + oracle + path);
      this.in_progress = false;
      this.children = res.data.children;
      this.events = res.data.events;
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
  components: { ChildPicker, EventCard, Breadcrumbs },
};
</script>
