<template>
  <div>
    質問に投票する<br /><br />
    質問：{{ title }}<br />
    <form>
      <ul>
        <li v-for="option in options" :key="option.id" class="list-option">
          <input
            v-model="checkedOption"
            name="option"
            type="radio"
            :value="option.id"
          />{{ option.title }}
        </li>
      </ul>
    </form>
    <div class="comment">
      コメント(任意)<br />
      <textarea v-model="voteComment" row="5" />
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
      options: await getOptions(subjectId),
      title: await getTitle(subjectId),
    }
  },
  data: () => ({
    checkedOption: "",
    voteComment: "",
  }),
  methods: {
    // 投票する
    vote() {
      // 選択されている選択肢のIDを取得
      // TODO: 空の場合メッセージ出して終わる
      const checkedId = this.checkedOption
      if (checkedId) {
        // Firebaseの"votes"コレクションに新しいドキュメントを作り投票する
        // TODO: 同じsubjectId・authIdで既存なら、addではなく更新にする
        const newVote = {
          authId: firebase.auth().currentUser.uid,
          comment: this.voteComment,
          createdAt: new Date(),
          optionId: checkedId,
          questionTitle: this.title,
          subjectId: this.$route.params.id,
        }
        // console.log(newVote) // productionではコメント化
        db.collection("votes").add(newVote)
        alert("投票完了") // TODO: 投票後の画面に推移する
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
  const returnObject = []
  querySnapshot.forEach(function (doc) {
    const data = doc.data()
    returnObject.push({ id: doc.id, title: data.title })
  })
  return returnObject
}
</script>

<style lang="scss" scoped>
.button-vote {
  background-color: white;
  border-radius: 0.2em;
  color: black;
  padding: 0.2em 0.5em;
}
.list-option {
  list-style-type: none;
}
.comment {
  textarea {
    background-color: white;
    color: black;
  }
}
</style>
