<template>
  <div id="app" class="app-layout">
    <!-- Conditional Breadcrumbs rendering -->
    <BreadCrumb v-if="showBreadcrumbs" :breadcrumbs="$route.meta.breadcrumbs" class="pt-3" />

    <!-- Main content -->
    <div class="content">
      <router-view class=""></router-view>
    </div>

    <!-- Footer -->
    <SiteFooter v-if="!hideFooter" />
  </div>
</template>

<script>
// import HeaderBar from './components/HeaderBar.vue';
// import HeaderBarAlt from './components/HeaderBarAlt.vue'; // Import the alternate header
import SiteFooter from './components/SiteFooter.vue';
import BreadCrumb from './components/BreadCrumb.vue';

export default {
  name: 'App',
  components: {
    // HeaderBar,
    // HeaderBarAlt,
    SiteFooter,
    BreadCrumb
  },
  computed: {
    showHeaderFooter() {
      // General toggle for both header and footer
      return !this.$route.meta.hideHeaderFooter;
    },
    useDefaultHeader() {
      // Determine which header to use
      return !this.$route.meta.useAltHeader;
    },
    hideHeader() {
      // Specifically hide the header
      return this.$route.meta.hideHeaderFooter;
    },
    hideFooter() {
      // Specifically hide the footer; default to true if hideHeaderFooter is true
      return this.$route.meta.hideHeaderFooter || this.$route.meta.hideFooter;
    },
    showBreadcrumbs() {
      // Show breadcrumbs unless explicitly hidden
      return this.showHeaderFooter && !this.$route.meta.hideBreadcrumbs;
    }

  }
};
</script>

<style></style>
