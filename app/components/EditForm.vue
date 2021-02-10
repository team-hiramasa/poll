<template>
  <div class="mainform">
    <v-row> 質問の編集 </v-row>
    <v-row>
      <v-textarea
        v-model="titleData"
        counter="50"
        hint="入力例：好きなスポーツは？"
        label="質問"
        auto-grow="true"
        rows="1"
        :rules="[
          (v) => v.length <= 50 || '50字以内でお願いします',
          (v) => v.length != 0 || '入力してください',
        ]"
        @blur="titleData = titleData.replace(/\n/g, '')"
        @keydown.enter.prevent
      />
    </v-row>
    <slot />
    <v-row>
      投票結果の票数を表示するかどうか<v-spacer />
      <v-switch v-model="isPublicData" :label="isPublicMessage" />
    </v-row>
    <v-row>
      投票結果の票数を表示するかどうか<v-spacer />
      <v-switch v-model="isCloseVotedData" :label="isCloseVotedMessage" />
    </v-row>

    <v-row>
      <v-select
        :value="visibleOrderData"
        :items="orderitems"
        label="投票結果を何位まで表示するか"
        :rules="[(v) => v > 0 || '入力してください']"
        required
      />
    </v-row>

    <v-row>
      <v-col class="text-right">
        <v-btn v-if="isCreateMode" @click="onpushed">
          新規作成
        </v-btn>
        <v-btn v-else @click="onpushed">
          更新
        </v-btn>
      </v-col>
    </v-row>
  </div>
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
  computed: {
    titleData: {
      get(): string {
        return this.$props.title
      },
      set(value: string): void {
        this.$emit("update:title", value)
      },
    },
    optionListData: {
      get(): string {
        return this.$props.optionListData
      },
      set(value: string): void {
        this.$emit("update:optionListData", value)
      },
    },
    isCloseVotedData: {
      get(): string {
        return this.$props.isCloseVoted
      },
      set(value: string): void {
        this.$emit("update:isCloseVoted", value)
      },
    },
    isPublicData: {
      get(): string {
        return this.$props.isPublic
      },
      set(value: string): void {
        this.$emit("update:isPublic", value)
      },
    },
    visibleOrderData: {
      get(): number {
        return this.$props.visibleOrder
      },
      set(value: boolean): void {
        this.$emit("update:visibleOrder", value)
      },
    },
    isPublicMessage(): string {
      return this.isPublicData ? "公開する" : "公開しない"
    },
    isCloseVotedMessage(): string {
      return this.isCloseVotedData ? "表示する" : "表示しない"
    },
  },
  methods: {
    onpushed() {
      this.$emit("onpushed")
    },
  },
})
</script>
<style>
.mainform {
  width: 500px;
  margin: 0 auto;
}
</style>
