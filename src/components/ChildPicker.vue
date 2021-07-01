<template>
  <div v-if="children != null">
    <div v-if="isList">
      <v-row>
        <v-col v-for="item in children.list" :key="item.name">
          <v-card
            hover
            :to="hrefFor(item.name)"
            @mouseover="chosen_child = item.name"
            @mouseleave="chosen_child = null"
          >
            <v-card-title> {{ item.name }} </v-card-title>
            <v-card-text>
              {{ $describe.path_short(pathFor(item.name)) }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div v-if="children.kind == 'range' && children['range-kind'] == 'time'">
      <v-card>
        <v-card-title>Choose a date and time</v-card-title>
        <v-card-text>
          <date-time-picker :value="chosen_date" @input="chosen_date = $event"
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
    </div>
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
  },
  computed: {
    isList() {
      return this.children.kind == "list";
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
