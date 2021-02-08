<template>
  <div class="py-3">
    <v-row>
      <v-col>
        <table class="validtable text-center">
          <thead>
            <tr>
              <th height="64" width="48">
                ID
              </th>
              <th>
                保存される選択肢
              </th>
            </tr>
          </thead>
          <tbody
            is="draggable"
            v-model="validoptions"
            tag="tbody"
            group="options-list"
            dark
            @end="renumberOrders"
          >
            <tr v-for="(item, i) in validoptions" :key="i" height="32">
              <td height="32">
                {{ item.id }}
              </td>
              <td class="px-2">
                <v-text-field
                  v-model="validoptions[i].option"
                  append-outer-icon="mdi-close"
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
            v-model="invalidoptions"
            tag="tbody"
            group="options-list"
            @end="renumberOrders"
          >
            <tr v-for="(item, i) in invalidoptions" :key="i">
              <td>{{ item.id }}</td>
              <td class="px-2">
                {{ invalidoptions[i].option }}
                <v-icon style="float: right;" @click="redoOption(i)">
                  mdi-redo
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
      get() {
        return this.$props.validoptions
      },
      set(value) {
        this.$emit("update:validoptions", value)
      },
    },
    invalidoptionsData: {
      get() {
        return this.$props.invalidoptions
      },
      set(value) {
        this.$emit("update:invalidoptions", value)
      },
    },
  },
  methods: {
    renumberOrders() {
      const me = this
      for (let i = 0; me.validoptionsData.length > i; i++) {
        me.validoptionsData[i].id = i + 1
      }
      for (let i = 0; me.invalidoptionsData.length > i; i++) {
        me.invalidoptionsData[i].id = i + 1
      }
    },

    addOption() {
      const me = this
      me.validoptionsData.push({
        id: me.validoptionsData.length - 1,
        option: "",
      })
      me.renumberOrders()
    },

    deleteOption(index: number) {
      const me = this
      me.invalidoptionsData.push(me.validoptionsData[index])
      me.validoptionsData.splice(index, 1)
      me.renumberOrders()
    },

    redoOption(index: number) {
      const me = this
      me.validoptionsData.push(me.invalidoptionsData[index])
      me.invalidoptionsData.splice(index, 1)
      me.renumberOrders()
    },
  },
})
</script>
