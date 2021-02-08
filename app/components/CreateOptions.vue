<template>
  <div>
    <v-row>
      <v-textarea
        v-model="optionListData"
        label="回答"
        hint="改行で選択肢になります。"
        :rules="[(v) => v.length > 0 || '入力してください']"
      />
    </v-row>
    <v-row>
      <v-textarea v-model="optionListExample" label="入力例" disabled />
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    optionList: {
      type: String,
      default: "",
    },
    optionListExample: {
      type: String,
      default: "サッカー\n野球\nテニス",
    },
  },
  computed: {
    optionListData: {
      get(): String {
        return this.$props.optionList
      },
      set(value: string): any {
        this.$emit("update:optionList", value)
      },
    },
  },
})
</script>
