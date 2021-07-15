<template>
  <v-container>
    <v-row>
      <v-col>
        <breadcrumbs :items="breadcrumbs">
          <v-btn icon @click="copyToClipboard(eventUrl())">
            <v-icon medium>mdi-content-copy</v-icon>
          </v-btn>
        </breadcrumbs>
        <p>
          {{ $describe.event_short(event_id) }}
        </p>
      </v-col>
    </v-row>

    <v-row v-if="announcement != null">
      <v-col>
        <v-card>
          <v-card-title> possible outcomes </v-card-title>
          <v-card-text>
            <ul>
              <li
                v-for="outcome in announcement.descriptor.outcomes"
                :key="outcome"
                class="display-1"
              >
                {{ outcome }}
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title> Outcome </v-card-title>
          <v-card-text class="display-2" v-if="attestation">
            {{ attestation.outcome }}
          </v-card-text>
          <v-card-text v-else-if="announcement">
            {{ countdown }} at {{ announcement.expected_outcome_time }} UTC
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="announcement != null">
      <v-col>
        <v-card @click="show_announcement = !show_announcement" hover>
          <v-card-title> Announcement </v-card-title>
          <v-expand-transition>
            <div v-show="show_announcement">
              <v-divider></v-divider>
              <v-card-text>
                <pre class="language-markup">{{
                  JSON.stringify(announcement, null, "\t")
                }}</pre>
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import Breadcrumbs from "../components/Breadcrumbs";
import formatDistance from "date-fns/formatDistance";

export default {
  name: "Event",
  created: async function () {
    await this.fetchEvent();
    this.timer_interval = setInterval(this.updateTime, 1000);
  },
  data: () => ({
    event_info: null,
    show_announcement: false,
    expected_outcome_time: null,
    current_time: Date.now(),
    timer_interval: null,
    attestation: null,
    announcement: null,
    last_fetched: null,
  }),
  beforeDestroy() {
    this.timer_interval && clearInterval(this.timer_interval);
  },
  methods: {
    updateTime() {
      this.current_time = Date.now();
      if (
        this.expected_outcome_time &&
        this.current_time >= this.expected_outcome_time &&
        this.attestation == null &&
        this.current_time - this.last_fetched > 60000
      ) {
        console.log("fetched");
        this.fetchEvent();
      }
    },
    async fetchEvent() {
      this.last_fetched = Date.now();
      let res = await axios(this.eventUrl());
      let event_info = res.data;
      this.event_info = event_info;
      this.announcement = JSON.parse(event_info.announcement.oracle_event.data);
      if (this.announcement.expected_outcome_time != null) {
        this.expected_outcome_time = Date.parse(
          this.announcement.expected_outcome_time + "Z"
        );
      }
      this.attestation = event_info.attestation;
    },
    eventUrl() {
      let event_kind = this.$route.params.event_kind;
      let oracle = this.$route.params.oracle;
      let path = this.$route.params.path;
      return "https://" + oracle + path + "." + event_kind;
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
      return this.$route.params.path + "." + this.$route.params.event_kind;
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
  components: { Breadcrumbs },
};
</script>
