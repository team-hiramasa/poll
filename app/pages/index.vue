<template>
  <v-app>
    <v-app-bar fixed app>
      <v-tabs class="elevation-2" dark centered="centered" fixed-tabs>
        <v-tabs-slider />
        <v-tab
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          v-text="item.title"
        />
      </v-tabs>
    </v-app-bar>
    <v-tabs-items>
      <v-tab-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        v-text="item.title"
      />
    </v-tabs-items>
    <v-list>
      <template v-for="(subject, index) in subjects">
        <v-list-item :key="index" :to="subject.id">
          <v-list-item-content>
            <v-list-item-title>{{ subject.title }} </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
    <p>これはpタグ：{{ subjects[0].title }}</p>
  </v-app>
</template>

<script>
import firebase from "@/plugins/firebase"
const db = firebase.firestore()

export default {
  async asyncData() {
    // const subjects = params.id
    return {
      subjects: await getSubjects(),
    }
  },
  data() {
    return {
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
}

async function getSubjects() {
  return await db
    .collection("subjects")
    .get()
    .then((res) => {
      console.log(
        "startGetSubjects ==============================================================="
      )
      res.forEach((doc) => {
        console.log(doc.id, "=>", doc.data())
      })
      console.log(
        "end ============================================================================"
      )
      const subjects = []
      res.forEach((doc) => {
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
      return subjects
    })
    .catch((err) => {
      console.log("Error getting documents", err)
    })
}
</script>
