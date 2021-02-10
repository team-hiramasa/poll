<template>
  <div class="py-3">
    <v-row>
      <v-col>
        <table class="validtable text-center">
          <thead>
            <tr>
              <th height="64" width="48">
                No.
              </th>
              <th>
                保存される選択肢
              </th>
            </tr>
          </thead>
          <tbody
            is="draggable"
            v-model="validoptionsData"
            tag="tbody"
            group="options-list"
            dark
          >
            <tr v-for="(item, i) in validoptionsData" :key="i" height="32">
              <td height="32">
                {{ item.order + 1 }}
              </td>
              <td class="px-2">
                <v-textarea
                  v-model="item.title"
                  append-outer-icon="mdi-close"
                  counter="50"
                  :auto-grow="true"
                  rows="1"
                  :rules="[
                    (v) => v.length <= 50 || '50字以内でお願いします',
                    (v) => v.length > 0 || '入力してください',
                  ]"
                  @blur="item.title = item.title.replace(/\n/g, '')"
                  @keydown.enter.prevent
                  @click:append-outer="deleteOption(i)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-right">
        <v-btn class="blue darken-2" @click="addOption">
          新規選択肢を追加
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <table class="invalidtable text-center">
          <thead>
            <tr>
              <th height="64" width="48">
                ID
              </th>
              <th>
                削除される選択肢
              </th>
            </tr>
          </thead>
          <tbody
            is="draggable"
            v-model="invalidoptionsData"
            tag="tbody"
            group="options-list"
          >
            <tr v-for="(item, i) in invalidoptions" :key="i">
              <td>{{ item.order + 1 }}</td>
              <td class="px-2">
                {{ item.title }}
                <v-icon style="float: right;" @click="undoOption(i)">
                  mdi-undo
                </v-icon>
              </td>
            </tr>
          </tbody>
        </table>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import draggable from "vuedraggable"

export type Option = {
  id: string
  subjectId: string
  order: number
  title: string
}
export default Vue.extend({
  components: {
    draggable,
  },
  props: {
    validoptions: {
      type: Array,
      default: () => {},
    },
    invalidoptions: {
      type: Array,
      default: () => {},
    },
  },
  computed: {
    validoptionsData: {
      get(): Array<Option> {
        return this.$props.validoptions
      },
      set(value: Array<Option>): void {
        this.$emit("update:validoptions", value)
      },
    },
    invalidoptionsData: {
      get(): Array<Option> {
        return this.$props.invalidoptions
      },
      set(value: Array<Option>): void {
        this.$emit("update:invalidoptions", value)
      },
    },
  },
  watch: {
    validoptionsData() {
      const me = this
      for (const i in me.validoptionsData) {
        me.validoptionsData[Number(i)].order = Number(i)
      }
    },
    invalidoptionsData() {
      const me = this
      for (const i in me.invalidoptionsData) {
        me.invalidoptionsData[Number(i)].order = Number(i)
      }
    },
  },
  methods: {
    addOption() {
      this.validoptionsData.push({
        id: "",
        subjectId: "",
        order: this.validoptionsData.length,
        title: "",
      })
    },

    deleteOption(index: number) {
      if (
        this.validoptionsData[index].subjectId.length > 0 ||
        this.validoptionsData[index].title.length > 0
      ) {
        this.invalidoptionsData.push(this.validoptionsData[index])
      }
      this.validoptionsData.splice(index, 1)
    },

    undoOption(index: number) {
      this.validoptionsData.push(this.invalidoptionsData[index])
      this.invalidoptionsData.splice(index, 1)
    },
  },
})
</script>
