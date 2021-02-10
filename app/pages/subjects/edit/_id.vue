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
export type Option = {
  id: string
  subjectId: string
  order: number
  title: string
}

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
      validoptions: [] as Array<Option>,
      invalidoptions: [] as Array<Option>,
    }
  },
  created() {
    const currentId = this.$route.params.id
    const docRef = db.collection("subjects").doc(currentId)
    const me = this
    docRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          const currentSubject: any = doc.data()
          me.subject.title = currentSubject.title
          me.subject.isPublic = currentSubject.isPublic
          me.subject.isCloseVoted = currentSubject.isCloseVoted
          me.subject.visibleOrder = currentSubject.visibleOrder
          console.log("Document data:", doc.data())
          db.collection("options")
            .where("subjectId", "==", currentId)
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                me.validoptions.push({
                  id: String(doc.id),
                  subjectId: String(doc.data().subjectId),
                  title: String(doc.data().title),
                  order: Number(doc.data().order),
                })
                me.validoptions.sort(function (a, b) {
                  return Number(a.order) - Number(b.order)
                })
                console.log(doc.id, " => ", doc.data())
              })
            })
            .catch(function (error) {
              console.log("Error getting documents: ", error)
            })
        } else {
          console.log("No such document!")
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error)
      })
  },
  methods: {
    async editSubject() {
      const currentMainSubjectId = this.$route.params.id
      const me = this
      const batch = db.batch()

      const subjectRef = db.collection("subjects").doc(currentMainSubjectId)

      // Subject 更新
      batch.set(subjectRef, {
        title: me.subject.title,
        isPublic: me.subject.isPublic,
        isCloseVoted: me.subject.isCloseVoted,
        visibleOrder: me.subject.visibleOrder,
      })

      // Options 更新
      for (const i in me.validoptions) {
        const currentId = me.validoptions[Number(i)].id
        const currentOrder = me.validoptions[Number(i)].order
        const currentTitle = me.validoptions[Number(i)].title
        const currentSubjectId = me.validoptions[Number(i)].subjectId
        if (currentSubjectId.length > 0) {
          const validOptionRef = db.collection("options").doc(currentId)
          batch.update(validOptionRef, {
            subjectId: currentSubjectId,
            title: currentTitle,
            order: currentOrder,
          })
        } else {
          // Options 新規作成
          db.collection("options")
            .add({
              subjectId: currentMainSubjectId,
              title: currentTitle,
              order: currentOrder,
            })
            .catch((error) => {
              console.log("[ERROR] in getting documents: ", error)
            })
        }
      }

      // Options 削除
      for (const i in me.invalidoptions) {
        const currentOptionId = me.invalidoptions[Number(i)].id
        if (currentOptionId.length > 0) {
          const invalidOptionRef = db.collection("options").doc(currentOptionId)
          batch.delete(invalidOptionRef)
        }
      }

      await batch.commit()
      document.location.reload()
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
