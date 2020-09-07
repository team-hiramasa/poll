<template>
  <div>
    質問に投票する<br /><br />
    質問：{{ title }}<br />
    <ul>
      <li v-for="option in options" :key="option.title">
        {{ option.title }}
      </li>
    </ul>
    <div>
      コメント(任意)
    </div>
    <button>
      投票する
    </button>
  </div>
</template>

<script>
import firebase from "~/plugins/firebase.ts"

const db = firebase.firestore()

export default {
  async asyncData({ params }) {
    const subjectId = params.id
    return {
      title: await getTitle(subjectId),
      options: await getOptions(subjectId),
    }
  },
}

async function getTitle(subjectId) {
  const doc = await db
    .collection("subjects")
    .doc(subjectId)
    .get()
    .catch(function (error) {
      console.log("Error getting documents: ", error)
    })
  if (doc.exists) {
    return doc.data().title
  } else {
    console.log("No document")
  }
}

async function getOptions(subjectId) {
  const querySnapshot = await db
    .collection("options")
    .where("subjectId", "==", subjectId)
    .get()
    .catch(function (error) {
      console.log("Error getting documents: ", error)
    })
  const data = []
  querySnapshot.forEach(function (doc) {
    data.push({ title: doc.data().title })
  })
  return data
}
</script>
