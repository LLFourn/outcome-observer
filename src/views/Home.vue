<template>
  <v-container class="text-center">
    <v-row>
      <v-col cols="12">
        <h1>Outcome Observer</h1>
        <p>An oracle explorer</p>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="4">
        <v-card hover to="/h00.ooo">
          <v-card-title> h00.ooo </v-card-title>
          <v-card-text> <a href="https://twitter.com/LLFOURN">LLFourn</a>'s oracle he's using for this experiment </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="4">
        <v-card>
          <v-card-title> Or choose another </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="setOracle">
              <v-text-field
                filled
                v-model="oracle"
                label="The hostname of an oracle"
              />
            </v-form>
          </v-card-text>
        </v-card>
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
