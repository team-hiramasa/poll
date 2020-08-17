<template>
  <v-app>
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
    <v-tabs-items v-model="model">
      <v-tab-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        v-text="item.title"
      >
        <v-list nav="nav">
          <v-list-item
            v-for="(subject, index) in subjects"
            :key="index"
            :to="subject.id"
            router
            exact
          >
            <v-list-item-content>
              <v-list-item-title v-text="subject.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-tab-item>
    </v-tabs-items>
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
      subjects: [
        {
          id: "test_id",
          title: "test_title",
        },
        {
          id: "test_2",
          title: "test_2",
        },
      ],
    }
  },
}
</script>
