<template>
  <!--   <div> -->
  <!--     <v-row> -->
  <!--       <v-col cols="6"> -->
  <!-- <v-date-picker :value="date" @input="date = $event; update()" no-title> </v-date-picker> -->
  <!--   <v-time-picker :value="time" format="24hr" @input="time = $event; update()" :landscape="$vuetify.breakpoint.smAndUp" no-title> </v-time-picker> -->
  <!-- </v-col> -->
  <!-- </v-row> -->
  <!-- </div> -->
  <v-row>
    <v-col cols="12" sm="6">
      <v-menu
        v-model="date_menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="date"
          :min="min_date"
          :max="max_date"
          @input="
            date_menu2 = false;
            update();
          "
        ></v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="12" sm="6">
      <v-menu
        ref="menu"
        v-model="time_menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="time"
            prepend-icon="mdi-clock-time-four-outline"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker
          v-if="time_menu2"
          v-model="time"
          @input="update"
          format="24hr"
          :allowed-minutes="allowMinutes"
          :allowed-hours="allowHours"
          full-width
          @click:minute="$refs.menu.save(time)"
        ></v-time-picker>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "DateTimePicker",
  props: ["value", "interval", "start", "end", "next_unattested"],
  data() {
    let datetime = this.value;
    let interval = this.interval;
    if (datetime === null) {
      datetime = this.next_unattested;
    }
    return {
      date: datetime.substr(0, 10),
      date_menu: false,
      date_modal: false,
      date_menu2: false,
      time: datetime.substr(11, 5),
      time_menu2: false,
      time_modal2: false,
    };
  },
  created() {
    this.update();
  },
  methods: {
    update() {
      let dt = this.date + "T" + this.time + ":00";
      this.$emit("input", dt);
    },
    allowMinutes(v) {
      let interval = Math.floor(this.interval / 60);
      if (interval == 0) {
        return true
      }
      else {
        return (v % interval) === 0;
      }
    },
    allowHours(v) {
      let interval = Math.floor(this.interval / (60 * 60));
      if (interval == 0) {
        return true
      }
      else {
        return (v % interval) === 0;
      }
    }
  },
  computed: {
    min_date() { return this.start.substr(0,10) },
    max_date() { return this.end.substr(0,10) }
  }
};
</script>
