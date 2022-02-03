<template>
  <v-container>
    <v-row>
      <v-col class="text-center">
        <router-breadcrumbs>
          <v-btn icon @click="copyToClipboard(eventUrl())">
            <v-icon medium>mdi-content-copy</v-icon>
          </v-btn>
        </router-breadcrumbs>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="text-center">
        <p class="event-description" v-html="description"></p>
      </v-col>
    </v-row>

    <v-row v-show="in_progress" justify="center">
      <v-col cols="1">
        <v-progress-circular indeterminate />
      </v-col>
    </v-row>

    <v-row v-if="announcement != null">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title> Possible outcomes </v-card-title>
          <v-card-text>
            <ul v-if="announcement.descriptor.type == 'enum'">
              <li
                v-for="outcome in announcement.descriptor.outcomes"
                :key="outcome"
                class="display-1"
              >
                <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs}">
                  <span v-on="on" v-bind="attrs">
                    {{ outcome }}
                  </span>
                </template>
                <span> {{ $describe.outcome_str(event_id, outcome)  }}</span>
                </v-tooltip>
              </li>
            </ul>
            <span v-if="announcement.descriptor.type == 'digit-decomposition'">
              price from 0 to {{ Math.pow(2, announcement.descriptor.n_digits) - 1 }}
            </span>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title> Outcome </v-card-title>
          <v-card-text class="display-2" v-if="attestation">
            {{ attestation.outcome }}
          </v-card-text>
          <v-card-text v-else-if="expected_outcome_time">
            {{ countdown }} on {{ new Date(expected_outcome_time) }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="announcement != null">
      <v-expansion-panels popout multiple>
        <v-expansion-panel
          v-for="[title, body] in [
            ['Announcement', announcement],
            ['Attestation', attestation],
          ]"
          :key="`${title}-expansion-drawer`"
          :disabled="body == null"
        >
          <v-expansion-panel-header>
            <v-row justify="center"
              ><v-col cols="6" class="text-center">{{ title }}</v-col></v-row
            ></v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <pre class="json-dump"> {{ JSON.stringify(body, null, "\t") }} </pre>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import RouterBreadcrumbs from "../components/RouterBreadcrumbs";
import formatDistance from "date-fns/formatDistance";

export default {
  name: "Event",
  created: async function () {
    try {
      this.in_progress = true;
      await this.fetchEvent();
    } catch (e) {
      this.$root.set_error(`could not fetch from ${this.eventUrl()} (${e})`);
    } finally {
      this.in_progress = false;
    }
    this.timer_interval = setInterval(this.updateTime, 1000);
  },
  data: () => ({
    event_info: null,
    expected_outcome_time: null,
    current_time: Date.now(),
    timer_interval: null,
    attestation: null,
    announcement: null,
    last_fetched: null,
    in_progress: false,
  }),
  beforeDestroy() {
    this.stopTimer();
  },
  methods: {
    stopTimer() {
      this.timer_interval && clearInterval(this.timer_interval);
    },
    async updateTime() {
      this.current_time = Date.now();
      if (
        this.expected_outcome_time &&
        this.current_time >= this.expected_outcome_time + 1000 &&
        this.attestation == null &&
        (this.last_fetched == null ||
          this.current_time - this.last_fetched > 60000)
      ) {
        this.last_fetched = Date.now();
        await this.fetchEvent();
      }
    },
    async fetchEvent() {
      let res = await axios(this.eventUrl());
      let event_info = res.data;
      this.event_info = event_info;
      this.announcement = JSON.parse(event_info.announcement.oracle_event.data);
      let expected_outcome_time = this.announcement["expected-outcome-time"];
      if (expected_outcome_time != null) {
        this.expected_outcome_time = Date.parse(
          expected_outcome_time + "Z"
        );
      }
      this.attestation = event_info.attestation;
      if (this.attestation != null) {
        this.stopTimer();
      }
    },
    eventUrl() {
      let oracle = this.$route.params.oracle;
      return "https://" + oracle + this.event_id;
    },
    copyToClipboard(text) {
      window.navigator.clipboard.writeText(text);
    },
  },
  computed: {
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
      breadcrumbs.push({ text: this.$route.params.event_kind, divider: "." });
      return breadcrumbs;
    },
    event_id() {
      let oracle = this.$route.params.oracle;
      let event_id = this.$route.fullPath.slice(oracle.length + 1);
      return event_id;
    },
    description() {
      let event_id = this.event_id;
      let html_string = this.$describe.event_html_str(event_id) + ".";
      if (html_string != null) {
        let oracle = this.$route.params.oracle;
        let parser = new DOMParser();
        let html = parser.parseFromString(html_string, "text/html");
        html
          .querySelectorAll("blockquote")
          .forEach((x) => x.setAttribute("class", "blockquote"));
        html
          .querySelectorAll("a.oracle-event-id")
          .forEach((x) =>
            x.setAttribute("href", "/" + oracle + x.getAttribute("href"))
          );
        return html.documentElement.innerHTML;
      }
    },
    countdown() {
      if (this.expected_outcome_time == null) {
        return null;
      }
      let prefix =
        this.expected_outcome_time >= this.current_time
          ? "should be known "
          : "should have been known ";
      return (
        prefix +
        formatDistance(this.expected_outcome_time, this.current_time, {
          addSuffix: true,
          includeSeconds: true,
        })
      );
    },
  },
  components: { RouterBreadcrumbs },
};
</script>

<style scoped>
  .json-dump { overflow: auto; }
  .event-description:first-letter {
      text-transform:capitalize;
  }
</style>
