import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

import("olivia_describe")
  .then((mod) => {
    Vue.prototype.$describe = mod;
    new Vue({
      router,
      vuetify,
      render: (h) => h(App),
    }).$mount("#app");
  })
  .catch((e) => {
    console.log("failed to load wasm: " + e);
  });
