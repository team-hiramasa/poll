<template>
  <v-app>
    <v-container class="px-0" fluid>
      <v-form ref="form" v-model="valid" lazy-validation>
        <edit-form
          :title.sync="subject.title"
          :option-list.sync="subject.optionList"
          :is-public.sync="subject.isPublic"
          :is-close-voted.sync="subject.isCloseVoted"
          :visible-order.sync="subject.visibleOrder"
          :orderitems.sync="subject.orderitems"
          :option-list-example.sync="subject.optionListExample"
          :is-create-mode="true"
          @onpushed="createSubject"
        >
          <create-options :option-list.sync="subject.optionList" />
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
      },
    }
  },
  methods: {
    async createSubject() {
      const form: any = this.$refs.form
      if (form.validate()) {
        const newSubject = db.collection("subjects")
        const newOptions = db.collection("options")

        await defaultAuth.onAuthStateChanged((user) => {
          if (user) {
            this.subject.currentAuthId = user.uid
          } else {
            location.href = "/"
          }
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
            for (
              let counter = 0;
              counter < objectsListArray.length;
              counter++
            ) {
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
            this.$router.push("/subjects/edit/" + newSubjectId)
          })
          .catch((error) => {
            console.log("[ERROR] in getting documents: ", error)
          })
      }
    },
  },
})
</script>
