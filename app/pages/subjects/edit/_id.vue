<template>
  <v-layout>
    <v-flex class="text-center">
      <img src="/v.png" alt="Vuetify.js" class="mb-5" />
      <blockquote class="blockquote">
        <footer>
          <small>
            <em>This ID is "{{ $route.params.id }}"</em>
          </small>
        </footer>
      </blockquote>
    </v-flex>
  </v-layout>
</template>

<script>
import firebase from "@/plugins/firebase"
const db = firebase.firestore()

export default {
  async asyncData() {
    return {
      subjects: await getSubjects(),
    }
  },
  data() {
    return {
      counter: 0,
      items: [
        {
          title: "回答した質問",
          to: "/#voted",
        },
        {
          title: "作成した質問",
          to: "/#created",
        },
      ],
    }
  },
  methods: {
    countUp() {
      this.counter += 1
    },
  },
}

async function getSubjects() {
  return await db
    .collection("subjects")
    .get()
    .then((snapshot) => {
      console.log(
        "startGetSubjects ==============================================================="
      )
      snapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data())
      })
      console.log(
        "end ============================================================================"
      )

      const subjects = []
      if (snapshot.empty) {
        console.log("Nomatching documents.")
        subjects.push({
          id: "",
          title: "見つかりませんでした",
          authId: "",
          isPublic: "",
          isCloseVoted: "",
          visibleOrder: "",
          createdAt: "",
        })
      } else {
        snapshot.forEach((doc) => {
          const params = doc.data()
          subjects.push({
            id: doc.id,
            title: params.title,
            authId: params.authId,
            isPublic: params.isPublic,
            isCloseVoted: params.isCloseVoted,
            visibleOrder: params.visibleOrder,
            createdAt: params.createdAt,
          })
        })
      }
      return subjects
    })
    .catch((err) => {
      console.log("Error getting documents", err)
    })
}
</script>
