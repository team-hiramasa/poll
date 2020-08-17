<template>
  <v-app>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer app>
      <span>&copy; {{ copyright }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      copyright: "created by Team Hiramasa",
    }
  },
}
</script>
