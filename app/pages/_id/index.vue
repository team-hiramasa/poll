<template>
  <div>
    質問に投票する<br /><br />
    質問：{{ title }}<br />
    <form>
      <ul>
        <li v-for="option in options" :key="option.title" class="list-option">
          <input name="option" type="radio" />{{ option.title }}
        </li>
      </ul>
    </form>
    <div>
      コメント(任意)<br />
      <input type="text" />
    </div>
    <button class="button-vote" @click="vote">
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
  methods: {
    // 投票する
    vote: () => {
      const checkedOption = document.querySelector("input[name=option]:checked")
      let checkedLabel = ""
      if (checkedOption) {
        const nextDOM = checkedOption.nextSibling
        if (nextDOM) {
          checkedLabel = nextDOM.textContent.replace(/(^\s+)|(\s+$)/g, "")
        }
      }
      if (checkedLabel) {
        console.log("TODO: 「" + checkedLabel + "」に投票する")
        // WIP
        // Firebaseの"votes"コレクションに新しいドキュメントを作り
        // 下記フィールドの値を入力する
        // authId, comment, createdAt, optionId, questionTitle, subjectId
      }
    },
  },
}

// 質問のタイトルを取得する
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

// 質問の選択肢を取得する
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

<style>
.button-vote {
  background-color: white;
  border-radius: 0.2em;
  color: black;
  padding: 0.2em 0.5em;
}
.list-option {
  list-style-type: none;
}
</style>
