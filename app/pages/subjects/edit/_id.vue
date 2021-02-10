<template>
  <v-app>
    <v-container class="px-0" fluid>
      <v-form ref="form" v-model="valid" lazy-validation>
        <edit-form
          :title.sync="subject.title"
          :option-list.sync="subject.optionList"
          :is-public.sync="subject.isPublic"
          :is-close-vote.sync="subject.isCloseVoted"
          :visible-order.sync="subject.visibleOrder"
          :orderitems.sync="subject.orderitems"
          :option-list-example.sync="subject.optionListExample"
          :is-create-mode="false"
          @onpushed="editSubject"
        >
          <edit-options
            :validoptions.sync="validoptions"
            :invalidoptions.sync="invalidoptions"
          />
        </edit-form>
      </v-form>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue"
import firebase from "@/plugins/firebase"
import EditForm from "@/components/EditForm.vue"

const db = firebase.firestore()
const defaultAuth = firebase.auth()

export default Vue.extend({
  components: {
    EditForm,
  },
  data() {
    return {
      valid: true,
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
    editSubject() {
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
