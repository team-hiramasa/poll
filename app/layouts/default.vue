<template>
  <v-app dark>
    <v-app-bar fixed app>
      <v-tabs
        v-model="tab"
        class="elevation-2"
        dark
        centered="centered"
        fixed-tabs
      >
        <v-tabs-slider />
        <v-tab
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          v-text="item.title"
        />
      </v-tabs>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ copyright }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          title: "回答した質問",
          to: "/#voted",
        },
        {
          title: "作成した質問",
          to: "/#created",
        },
      ],
      copyright: "created by Team Hiramasa",
    }
  },
}
</script>
