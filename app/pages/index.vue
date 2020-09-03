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
      >
        <v-list nav="nav">
          <!-- <v-list-item
            v-for="(subject, index) in subjects"
            :key="index"
            :to="subject.title"
            router
            exact
          >
            <v-list-item-content>
              <v-list-item-title v-text="subject.title" />
            </v-list-item-content>
          </v-list-item> -->
        </v-list>
      </v-tab-item>
    </v-tabs-items>
  </v-app>
</template>

<script>
import firebase from "@/plugins/firebase"
const db = firebase.firestore()
const subjectsRef = db.collection("subjects").get()
subjectsRef
  .then((res) => {
    const subjects = res
    subjects.forEach((doc) => {
      console.log(doc.id, "=>", doc.data())
    })
  })
  .catch((err) => {
    console.log("Error getting documents", err)
  })

export default {
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
</script>
