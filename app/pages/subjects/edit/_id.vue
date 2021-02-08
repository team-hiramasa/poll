<template>
  <v-app>
    <v-container class="px-0" fluid>
      <div>
        <edit-form
          :title.sync="subject.title"
          :option-list.sync="subject.optionList"
          :is-public.sync="subject.isPublic"
          :is-close-vote.sync="subject.isCloseVoted"
          :visible-order.sync="subject.visibleOrder"
          :orderitems.sync="subject.orderitems"
          :option-list-example.sync="subject.optionListExample"
          :is-create-mode="false"
          :page="1"
          @renumberOrders="renumberOrders"
        >
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
        </edit-form>
        <v-row>
          <v-spacer />
          <v-btn type="submit" @onpushed="editsubject">
            更新
          </v-btn>
        </v-row>
      </div>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue"
import draggable from "vuedraggable"
import firebase from "@/plugins/firebase"
import EditForm from "@/components/EditForm.vue"

const db = firebase.firestore()
const defaultAuth = firebase.auth()

export default Vue.extend({
  components: {
    EditForm,
    draggable,
  },
  data() {
    return {
      headers: [
        { text: "ID", value: "id" },
        { text: "部門名", value: "name" },
      ],
      subject: {
        currentAuthId: "",
        title: "",
        optionList: "",
        isPublic: true,
        isCloseVoted: true,
        visibleOrder: 1,
        orderitems: [1, 2, 3],
        optionListExample: "サッカー\n野球\nテニス",
      },

      validoptions: [
        {
          id: 1,
          option: "アイデア1",
        },
        {
          id: 2,
          option: "アイデア2",
        },
        {
          id: 3,
          option: "アイデア3",
        },
      ],
      invalidoptions: [
        {
          id: 1,
          option: "没アイデア1",
        },
        {
          id: 2,
          option: "没アイデア2",
        },
      ],
    }
  },
  methods: {
    editsubject() {
      const subject = db.collection("subjects")
      const options = db.collection("options")

      defaultAuth.onAuthStateChanged((user) => {
        if (user) {
          this.subject.currentAuthId = user.uid
        } else {
          location.href = "/"
        }
      })
      db.settings({
        timestampsInSnapshots: true,
      })

      subject
        .add({
          authId: this.subject.currentAuthId,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          title: this.subject.title,
          isCloseVoted: this.subject.isCloseVoted,
          isPublic: this.subject.isPublic,
          visibleOrder: this.subject.visibleOrder,
        })
        .then((ref) => {
          const subjectId = ref.id
          const objectsListArray = this.subject.optionList.split("\n")
          for (let counter = 0; counter < objectsListArray.length; counter++) {
            if (objectsListArray[counter] !== "") {
              options
                .add({
                  subjectId,
                  title: objectsListArray[counter],
                  order: counter,
                })
                .catch((error) => {
                  console.log("[ERROR] in getting documents: ", error)
                })
            }
          }
          location.href = "/subject/" + subjectId
        })
        .catch((error) => {
          console.log("[ERROR] in getting documents: ", error)
        })
    },

    renumberOrders() {
      const me = this
      for (let i = 0; me.validoptions.length > i; i++) {
        me.validoptions[i].id = i + 1
      }
      for (let i = 0; me.invalidoptions.length > i; i++) {
        me.invalidoptions[i].id = i + 1
      }
    },

    addOption() {
      const me = this
      me.validoptions.push({ id: me.validoptions.length - 1, option: "" })
      me.renumberOrders()
    },

    deleteOption(index: number) {
      const me = this
      me.invalidoptions.push(me.validoptions[index])
      me.validoptions.splice(index, 1)
      me.renumberOrders()
    },

    redoOption(index: number) {
      const me = this
      me.validoptions.push(me.invalidoptions[index])
      me.invalidoptions.splice(index, 1)
      me.renumberOrders()
    },
  },
})
</script>
<style>
table.validtable td {
  background-color: dodgerblue;
  padding: 0 4px;
}
table.invalidtable td {
  background-color: midnightblue;
  font-size: 1rem;
  padding: 4px;
}
table {
  height: 100%;
  width: 100%;
  font-size: 1rem;
  table-layout: fixed;
}
</style>
