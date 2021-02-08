<template>
  <v-form class="mainform">
    <v-row> 質問の編集 </v-row>
    <v-row>
      <v-text-field
        v-model="titleData"
        counter="25"
        hint="入力例：好きなスポーツは？"
        label="質問"
      />
    </v-row>
    <v-row>
      <v-textarea
        v-model="optionListData"
        label="回答"
        hint="改行で選択肢になります。"
      />
    </v-row>
    <v-row>
      <slot />
    </v-row>
    <v-row>
      投票結果の票数を表示するかどうか<v-spacer />
      <v-switch
        v-model="isPublicData"
        :label="`${isPublicMessage(isPublicData)}`"
      />
    </v-row>
    <v-row>
      投票結果の票数を表示するかどうか<v-spacer />
      <v-switch
        v-model="isCloseVotedData"
        :label="`${isCloseVotedMessage(isCloseVotedData)}`"
      />
    </v-row>

    <v-row>
      <v-select
        :value="visibleOrderData"
        :items="orderitems"
        :rules="[(v) => !!v || 'Item is required']"
        label="投票結果を何位まで表示するか"
        required
      />
    </v-row>

    <v-row>
      <v-spacer />
      <v-btn v-if="isCreateMode" @click="onpushed">
        新規作成
      </v-btn>
      <v-btn v-else @click="onpushed">
        更新
      </v-btn>
    </v-row>
  </v-form>
</template>

<script lang="ts">
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
      required: false,
    },
    page: {
      type: Number,
      default: 1,
      required: false,
    },
    isCloseVoted: {
      type: Boolean,
      default: true,
    },
    visibleOrder: {
      type: Number,
      default: 1,
    },
    orderitems: {
      type: Array,
      default: () => {},
    },
    optionListExample: {
      type: String,
      default: "",
    },
    isCreateMode: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      headers: [
        { text: "ID", value: "id" },
        { text: "選択肢名", value: "option" },
      ],
    }
  },
  computed: {
    titleData: {
      get() {
        return this.$props.title
      },
      set(value) {
        this.$emit("update:title", value)
      },
    },
    optionListData: {
      get() {
        return this.$props.optionListData
      },
      set(value) {
        this.$emit("update:optionListData", value)
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
    isPublicData: {
      get() {
        return this.$props.isPublic
      },
      set(value) {
        this.$emit("update:isPublic", value)
      },
    },
    visibleOrderData: {
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
      return value ? "公開する" : "公開しない"
    },
    isCloseVotedMessage(value: boolean) {
      return value ? "表示する" : "表示しない"
    },
    onpushed() {
      this.$emit("onpushed")
    },
    onEnd() {
      this.$emit("onend")
    },
  },
})
</script>
<style>
.mainform {
  width: 400px;
  margin: 0 auto;
}
</style>
