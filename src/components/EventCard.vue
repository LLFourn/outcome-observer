<template>
  <v-card :to="'/' + oracle + event" v-on="$listeners" hover height="100%">
    <v-card-title>
      <h3>{{ kind(event) }}</h3>
      <v-spacer /> <v-icon>{{ "mdi-file" }}</v-icon>
    </v-card-title>
    <v-card-text>
      {{ $describe.event_short(event) }}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "EventCard",
  props: ["event", "oracle"],
  methods: {
    kind(id) {
      return id.substr(id.lastIndexOf(".") + 1);
    },
  },
};
</script>
