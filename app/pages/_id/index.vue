<template>
  <div>
    <div v-if="showResult === false" class="vote">
      質問に投票する<br /><br />
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
    <div v-else class="result">
      投票結果<br /><br />
      <ul>
        <li v-for="option in options" :key="option.id" class="list-option">
          {{ option.title }}（{{ voteScores[option.id] }}）
        </li>
      </ul>
      <!-- TODO: 下記リンク先を画面遷移なしで出来ればそうする -->
      <a href="">投票し直す</a><br />
      <a href="/">トップに戻る</a>
    </div>
  </div>
</template>

<script>
import firebase from "~/plugins/firebase.ts"

const db = firebase.firestore()

export default {
  async asyncData({ params }) {
    const subjectId = params.id
    const questionData = await getQuestionData(subjectId)
    return {
      isPublic: questionData.isPublic,
      options: questionData.options,
      title: questionData.title,
    }
  },
  data: () => ({
    checkedOption: "",
    voteScores: {},
    showResult: false,
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
        // TODO: 同じsubjectId・authIdで投票済みなら、addではなく更新にする
        const newVote = {
          authId: firebase.auth().currentUser.uid,
          comment: this.voteComment,
          createdAt: new Date(),
          optionId: checkedId,
          questionTitle: this.title,
          subjectId: this.$route.params.id,
        }
        // console.log(newVote) // productionではコメント化

        // 投票＆次へ遷移
        db.collection("votes").add(newVote)
        this.afterVote()
      }
    },
    // 投票後の遷移
    afterVote() {
      if (this.isPublic) {
        // TODO: この条件の他、質問の作成者の場合もここに来させる
        // 投票結果を取得＆表示する
        const objectVotes = {}
        db.collection("votes")
          .where("subjectId", "==", this.$route.params.id)
          .get()
          .then((docs) => {
            docs.forEach((doc) => {
              const optionId = doc.data().optionId
              if (objectVotes[optionId]) {
                objectVotes[optionId]++
              } else {
                objectVotes[optionId] = 1
              }
            })
            this.voteScores = objectVotes
            this.showResult = true
          })
          .catch((error) => {
            console.log("[ERROR] in getQuestionData (votes) : ", error)
          })
      } else {
        // トップ（投票一覧）に戻る
        location.href = "/"
      }
    },
  },
}

// 質問の情報・選択肢をまとめて取得する
async function getQuestionData(subjectId) {
  const doc = await db
    .collection("subjects")
    .doc(subjectId)
    .get()
    .catch((error) => {
      console.log("[ERROR] in getting documents: ", error)
    })

  // 存在しないIDの質問がリクエストされた場合、トップに戻る
  if (!doc.exists) {
    location.href = "/"
  }

  // 質問の情報を取得
  const docData = doc.data()

  // 質問の選択肢を取得
  const querySnapshot = await db
    .collection("options")
    .where("subjectId", "==", subjectId)
    .get()
    .catch((error) => {
      console.log("[ERROR] in getQuestionData (options) : ", error)
    })
  const optionsAry = []
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    optionsAry.push({ id: doc.id, title: data.title })
  })

  return {
    isPublic: docData.isPublic,
    options: optionsAry,
    title: docData.title,
  }
}
</script>

<style lang="scss" scoped>
.vote {
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
}
</style>
