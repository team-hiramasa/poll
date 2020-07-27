<template>
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
</template>

<script>
export default {
  data() {
    return {
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
