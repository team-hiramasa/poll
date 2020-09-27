<template>
  <v-app>
    <v-container class="px-0" fluid>
      質問の編集
      <!-- 質問 -->
      入力例：好きなスポーツは？
      <!-- 回答 -->
      入力例：改行で選択肢になります。 サッカー 野球 バスケ テニス
      <!-- 投票結果をすぐに公開するかどうか -->
      <!-- 公開しない／公開する -->
      <v-switch
        v-model="isPublic"
        :label="`投票結果をすぐに公開するかどうか ${isPublic.toString()}`"
      />
      <label v-if="isPublic === true">
        公開する
      </label>
      <label v-else>
        公開しない
      </label>
      <!-- 投票結果の票数を表示するかどうか -->
      <!-- 公開しない／公開する -->
      <v-switch
        v-model="isCloseVoted"
        :label="`投票結果の票数を表示するかどうか: ${isCloseVoted.toString()}`"
      />

      <div v-if="isCloseVoted === true">
        表示しない
      </div>

      <div v-else>
        表示する
      </div>

      <!-- 投票結果を何位まで表示するか -->
      <v-select
        v-model="visibleOrder"
        :items="items"
        :rules="[(v) => !!v || 'Item is required']"
        label="Item"
        required
      />
    </v-container>
  </v-app>
</template>

<script>
// import firebase from "@/plugins/firebase";
// const db = firebase.firestore();
export default {
  data: () => ({
    isPublic: true,
    isCloseVoted: true,
    visibleOrder: 1,
    items: ["1", "2", "3"],
  }),
}
</script>
