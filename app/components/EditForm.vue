<template>
  <div class="mainform">
    <div>
      質問の編集
    </div>

    <v-text-field
      :value="title"
      counter="25"
      hint="入力例：好きなスポーツは？"
      label="質問"
      @input="$emit('update:title', $event)"
    />

    <v-textarea
      :value="optionList"
      label="回答"
      hint="改行で選択肢になります。"
      @input="$emit('update:optionList', $event)"
    />

    <v-textarea :value="optionListExample" label="入力例" disabled />
    <div>
      投票結果をすぐに公開するかどうか
      <v-switch
        v-model="isPublicData"
        :label="`${isPublicMessage(isPublicData)}`"
      />
    </div>

    <div>
      投票結果の票数を表示するかどうか
      <v-switch
        v-model="isCloseVotedData"
        :label="`${isCloseVotedMessage(isCloseVotedData)}`"
      />
    </div>
    <v-select
      :value="visibleOrder"
      :items="items"
      :rules="[(v) => !!v || 'Item is required']"
      label="投票結果を何位まで表示するか"
      required
      @input="$emit('update:visibleOrder', $event)"
    />
  </div>
</template>

<script lang="ts">
// 取得したoptionをテキストに変換
import Vue from "vue"

export default Vue.extend({
  props: {
    title: {
      type: String,
      default: "",
    },
    optionList: {
      type: String,
      default: "",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    isCloseVoted: {
      type: Boolean,
      default: true,
    },
    visibleOrder: {
      type: Number,
      default: 1,
    },
    items: {
      type: Array,
      default: () => {},
    },
    optionListExample: {
      type: String,
      default: "",
    },
  },
  computed: {
    isPublicData: {
      get() {
        return this.$props.isPublic
      },
      set(value) {
        this.$emit("update:isPublic", value)
      },
    },
    isCloseVotedData: {
      get() {
        return this.$props.isCloseVoted
      },
      set(value) {
        this.$emit("update:isCloseVoted", value)
      },
    },
  },
  methods: {
    isPublicMessage(value: boolean) {
      if (value) {
        return "公開する"
      } else {
        return "公開しない"
      }
    },
    isCloseVotedMessage(value: boolean) {
      if (value) {
        return "表示する"
      } else {
        return "表示しない"
      }
    },
  },
})
</script>
