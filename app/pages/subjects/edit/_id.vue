<template>
  <edit-form />
</template>

<script>
// import firebase from "@/plugins/firebase"
// const db = firebase.firestore()

// options取得

// subject取得

// 取得したoptionをテキストに変換

export default {
  data: () => ({
    title: "",
    choiceList: "",
    isPublic: true,
    isCloseVoted: true,
    visibleOrder: 1,
    items: ["1", "2", "3"],
  }),

  methods: {
    isPublicMessage(value) {
      if (value) {
        return "公開する"
      } else {
        return "公開しない"
      }
    },

    isCloseVotedMessage(value) {
      if (value) {
        return "公開する"
      } else {
        return "公開しない"
      }
    },
  },
}
</script>
