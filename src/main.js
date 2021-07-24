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
      data: {
        error : null,
        child_selected: null
      },
      methods: {
        set_error(e){
          this.error = e;
          setTimeout(() => { this.error = null }, 8000);
          this.$router.push({ name: "Home" });
        }
      },
      computed: {
        breadcrumbs() {
            let path = this.$route.params.path;
            let oracle = this.$route.params.oracle;
            let event_kind = this.$route.params.event_kind;
            let breadcrumbs;
            if (oracle != null) {
                breadcrumbs = [{ text: oracle, href: "/" + oracle, divider: "" }];
                if (path != null) {
                    let items = path.substr(1).split("/");
                    items.forEach((text) =>
                        breadcrumbs.push({
                            text,
                            href: breadcrumbs[breadcrumbs.length - 1].href + "/" + text,
                        })
                    );
                    if (event_kind != null) {
                        breadcrumbs.push({ text: this.$route.params.event_kind, divider: "." });
                    }
                }
              delete breadcrumbs[breadcrumbs.length - 1].href;
            }
            return breadcrumbs;
        }
      }
    }).$mount("#app");
  })
  .catch((e) => {
    console.log("failed to load wasm: " + e);
  });
