<template>
  <v-app>
    <v-container class="px-0" fluid>
      <edit-form
        :title.sync="subject.title"
        :option-list.sync="subject.optionList"
        :is-public.sync="subject.isPublic"
        :is-close-vote.sync="subject.isCloseVoted"
        :visible-order.sync="subject.visibleOrder"
        :orderitems.sync="subject.orderitems"
        :option-list-example.sync="subject.optionListExample"
        :is-create-mode="true"
        @onpushed="createSubject"
      >
        <create-options :option-list.sync="optionList" />
      </edit-form>
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
      subject: {
        currentAuthId: "",
        title: "",
        optionList: "",
        isPublic: true,
        isCloseVoted: true,
        visibleOrder: 1,
        orderitems: [1, 2, 3],
      },
    }
  },
  methods: {
    createSubject() {
      const newSubject = db.collection("subjects")
      const newOptions = db.collection("options")

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

      newSubject
        .add({
          authId: this.subject.currentAuthId,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          title: this.subject.title,
          isCloseVoted: this.subject.isCloseVoted,
          isPublic: this.subject.isPublic,
          visibleOrder: this.subject.visibleOrder,
        })
        .then((ref) => {
          const newSubjectId = ref.id
          const objectsListArray = this.subject.optionList.split("\n")
          for (let counter = 0; counter < objectsListArray.length; counter++) {
            if (objectsListArray[counter] !== "") {
              newOptions
                .add({
                  subjectId: newSubjectId,
                  title: objectsListArray[counter],
                  order: counter,
                })
                .catch((error) => {
                  console.log("[ERROR] in getting documents: ", error)
                })
            }
          }
          location.href = "/subject/" + newSubjectId
        })
        .catch((error) => {
          console.log("[ERROR] in getting documents: ", error)
        })
    },
  },
})
</script>
