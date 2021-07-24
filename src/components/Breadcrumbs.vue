<template>
  <span class="crumb">
    <span v-for="crumb in items">{{ crumb.divider == null ? "/" : crumb.divider}}<router-link v-if="crumb.href" :to="crumb.href">{{crumb.text}}</router-link><b>{{ crumb.href ? "" : crumb.text }}</b></span>
    <span class="text--disabled next-selection" v-show="next_selection">
      {{next_selection}}
    </span>
    <slot> </slot>
  </span>
</template>

<script>
export default {
  name: "Breadcrumbs",
  props: ["items", "next_selection"],
};
</script>

<style scoped>
.crumb a {
  text-decoration: none;
  color: inherit;
}
.crumb a:hover {
  color: orange;
}

.next-selection {
    position: absolute;
}
</style>
