<template>
  <div class="l-container" :class="[$route.meta.className]">
    <Header></Header>
    <div class="l-contents" style="overflow-y : auto;">
      <slot></slot>
    </div>
    <Footer :footer-style="$route.meta.footerStyle"></Footer>
  </div>
</template>

<script>
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default {
  name: "DefaultLayout",
  components: { Header, Footer }
};
</script>
