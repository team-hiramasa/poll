<template>
  <v-app>
    <v-container class="px-0" fluid>
      <div>
        質問の編集
      </div>

      <v-text-field
        v-model="title"
        :rules="rules"
        counter="25"
        hint="入力例：好きなスポーツは？"
        label="質問"
      />

      <v-textarea
        v-model="optionList"
        label="回答"
        value=""
        hint="改行で選択肢になります。"
      />

      <v-textarea
        v-model="optionListExample"
        label="入力例"
        value=""
        disabled
      />
      <div>
        投票結果をすぐに公開するかどうか
        <v-switch v-model="isPublic" :label="`${isPublicMessage(isPublic)}`" />
      </div>

      <div>
        投票結果の票数を表示するかどうか
        <v-switch
          v-model="isCloseVoted"
          :label="`${isCloseVotedMessage(isCloseVoted)}`"
        />
      </div>
      <v-select
        v-model="visibleOrder"
        :items="items"
        :rules="[(v) => !!v || 'Item is required']"
        label="投票結果を何位まで表示するか"
        required
      />
    </v-container>
  </v-app>
</template>

<script>
import firebase from "@/plugins/firebase"
const db = firebase.firestore()

// options取得

// subject取得
const subjectRef = db.collection("subjects").doc("SF")

subjectRef
  .get()
  .then(function (doc) {
    if (doc.exists) {
      console.log("Document data:", doc.data())
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!")
    }
  })
  .catch(function (error) {
    console.log("Error getting document:", error)
  })

// 取得したoptionをテキストに変換

export default {
  data: () => ({
    title: "",
    optionList: "",
    isPublic: true,
    isCloseVoted: true,
    visibleOrder: 1,
    items: ["1", "2", "3"],
    optionListExample: "サッカー\n野球\nバスケ\nテニス",
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
        return "表示する"
      } else {
        return "表示しない"
      }
    },
  },
}
</script>
