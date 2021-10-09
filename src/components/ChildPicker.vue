<template>
  <div v-if="children != null">
    <div v-if="children.kind == 'list'">
      <v-row>
        <v-col
          v-for="item in children.list"
          :key="item.name"
          cols="12"
          lg="4"
          md="6"
        >
          <v-card
            hover
            height="100%"
            :to="hrefFor(item.name)"
            @mouseover="chosen_child = item.name"
            @mouseleave="chosen_child = null"
          >
            <v-card-title>
              {{ $describe.long_path_name_str(pathFor(item.name)) }} <v-spacer />
              <v-icon>{{ iconFor(item.name) || "mdi-folder" }}</v-icon>
            </v-card-title>
            <v-card-text class="path-short-description">
              {{ $describe.path_short_str(pathFor(item.name)) }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <v-row
      v-if="children.kind == 'range' && children['range-kind'] == 'time'"
      justify="center"
    >
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title>Choose a date and time</v-card-title>
          <v-card-text>
            <date-time-picker
              :value="chosen_date"
              :start="children['start']"
              :end="children['end']"
              :next_unattested="children['next-unattested']"
              :interval="children['interval']"
              @input="chosen_date = $event"
          /></v-card-text>
          <v-card-actions>
            <v-btn
              outlined
              text
              :to="hrefFor(chosen_date)"
              @mouseover="chosen_child = chosen_date"
              @mouseleave="chosen_child = null"
            >
              GO
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import DateTimePicker from "./DateTimePicker";
export default {
  name: "ChildPicker",
  props: {
    oracle: String,
    path: { type: String },
    children: { type: Object },
  },
  data: () => ({
    chosen_child: null,
    chosen_date: null,
  }),
  methods: {
    pathFor(item) {
      return this.path == "/" ? "/" + item : this.path + "/" + item;
    },
    hrefFor(item) {
      return "/" + this.oracle + this.pathFor(item);
    },
    iconFor(item) {
      let path = this.pathFor(item);
      if (path == "/s") {
        return "mdi-soccer";
      } else if (path == "/x") {
        return "mdi-chart-line"
      } else if (path == "/s/EPL") {
        return "mdi-soccer";
      } else if (path == "/time") {
        return "mdi-timer-sand";
      } else if (path == "/random") {
        return "mdi-dice-multiple-outline";
      }
    },
  },
  components: { DateTimePicker },
  watch: {
    chosen_child(n, o) {
      this.$emit("selected", n);
    },
  },
};
</script>

<style scoped>
  .path-short-description:first-letter {
      text-transform:capitalize;
  }
</style>
