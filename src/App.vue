<template>
  <div id="app" class="app-layout">
    <!-- Conditional HeaderBar rendering -->
    <template v-if="!hideHeader">
      <HeaderBar v-if="useDefaultHeader" class="has-background-primary" />
      <HeaderBarAlt v-else class="has-background-primary" />
    </template>
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
import HeaderBar from './components/HeaderBar.vue';
import HeaderBarAlt from './components/HeaderBarAlt.vue'; // Import the alternate header
import SiteFooter from './components/SiteFooter.vue';
import BreadCrumb from './components/BreadCrumb.vue';

export default {
  name: 'App',
  components: {
    HeaderBar,
    HeaderBarAlt,
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

<style>
.title {
  font-family: 'Poppins', sans-serif;
}

html {
  overflow-x: hidden;
  max-width: 100vw;
}

.body {
  font-family: 'Roboto', sans-serif;
  color: #2C3E50;
  background-color: #ECF0F1;
  overflow-x: hidden;
  max-width: 100vw;
}

.table {
  background-color: #ECF0F1;
}

* {
  box-sizing: inherit;
}

img,
video {
  max-width: 100%;
  height: auto;
  display: block;
}
</style>
