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
          :items.sync="subject.items"
          :option-list-example.sync="subject.optionListExample"
        />
      </div>

      <v-btn type="submit" @click="createSubject">
        新規作成
      </v-btn>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue"
import firebase from "@/plugins/firebase"
import EditForm from "~/components/EditForm.vue"
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
        items: [1, 2, 3],
        optionListExample: "サッカー\n野球\nテニス",
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
          // No user is signed in.
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
          console.log(this.subject.title)
          console.log(this.subject.optionList)
          console.log(this.subject.isPublic)
          console.log(this.subject.isCloseVoted)
          console.log(this.subject.visibleOrder)
          console.log("Add ID: ", newSubjectId)
          for (let counter = 0; counter < objectsListArray.length; counter++) {
            if (objectsListArray[counter] !== "") {
              newOptions
                .add({
                  subjectId: newSubjectId,
                  title: objectsListArray[counter],
                })
                .catch((error) => {
                  console.log("[ERROR] in getting documents: ", error)
                  location.href = "/"
                })
            }
          }
          location.href = "/subject/" + newSubjectId
        })
        .catch((error) => {
          console.log("[ERROR] in getting documents: ", error)
          location.href = "/"
        })
    },
  },
})
</script>
