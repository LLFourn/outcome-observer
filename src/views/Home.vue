<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1>Outcome Observer</h1>
        <p>
          An oracle explorer
          <v-form @submit.prevent="setOracle">
            <v-text-field
              filled
              v-model="oracle"
              label="The hostname of an oracle"
            />
          </v-form>
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  methods: {
    setOracle: function () {
      this.$router.push({
        name: "oracle-root",
        params: {
          oracle: this.oracle,
        },
      });
    },
  },
  data: () => ({
    oracle: "",
  }),
};
</script>
