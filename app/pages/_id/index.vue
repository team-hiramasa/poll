<template>
  <div>
    <div v-if="showResult === false" class="vote">
      質問に投票する<br /><br />
      {{ title }}
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
          {{ option.title }}
          <span v-if="isCloseVoted === true">（{{ option.score }}）</span>
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
    const currentAuthId = firebase.auth().currentUser.uid
    const currentSubjectId = params.id
    const questionData = await getQuestionData(currentAuthId, currentSubjectId)
    const docData = questionData.subjectData
    return {
      authId: currentAuthId,
      isCloseVoted: docData.isCloseVoted,
      isMine: docData.createdMe,
      isPublic: docData.isPublic,
      options: questionData.options, // 選択肢の配列. 得票数も格納する
      subjectId: currentSubjectId,
      title: docData.title,
      visibleOrder: docData.visibleOrder,
      votedDocId: questionData.votedDocId,
    }
  },
  data: () => ({
    checkedOption: "",
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
        if (this.votedDocId) {
          // 同じsubjectId・authIdで投票済み. ドキュメントを更新する
          db.collection("votes").doc(this.votedDocId).set(
            {
              comment: this.voteComment,
              optionId: checkedId,
            },
            { merge: true }
          )
        } else {
          // 未投票. "votes"コレクションに新しいドキュメントを作り投票する
          db.collection("votes").add({
            authId: this.authId,
            comment: this.voteComment,
            createdAt: new Date(),
            optionId: checkedId,
            questionTitle: this.title,
            subjectId: this.subjectId,
          })
        }
        // 次へ遷移
        this.afterVote()
      }
    },

    // 投票後の遷移
    afterVote() {
      if (this.isMine || this.isPublic) {
        // 自分の質問 or すぐ結果を表示する設定なら, 投票結果を取得＆表示する
        this.showResult = true
        this.getResult()
      } else {
        // トップ（投票一覧）に戻る
        location.href = "/"
      }
    },

    // 投票結果を選択肢配列に反映する
    // TODO: isCloseVoted の値に応じた結果にする
    getResult() {
      db.collection("votes")
        .where("subjectId", "==", this.subjectId)
        .get()
        .then((docs) => {
          // 選択肢IDごとに得票数を格納する一時オブジェクトを作成
          const scores = {}
          docs.forEach((doc) => {
            const optionId = doc.data().optionId
            if (!scores[optionId]) {
              scores[optionId] = 1
            } else {
              scores[optionId]++
            }
          })
          // 得票数を選択肢配列に転記
          this.options.forEach((option) => {
            option.score = scores[option.id] || 0
          })
          // 選択肢配列を得票数の降順にソート
          this.options.sort((a, b) => {
            return a.score < b.score
          })
          // visibleOrderが0より大きければ、結果表示に反映する
          if (this.visibleOrder > 0) {
            // 表示用の一時配列を準備
            const newOptions = []
            let preScore = null
            this.options.forEach((option) => {
              // まず得票数の多い順に、visibleOrderの数だけ選択肢を配列に入れる
              // さらにvisibleOrder最後と同じ得票数の選択肢があれば、それも配列に入れる
              if (
                newOptions.length < this.visibleOrder ||
                option.score === preScore
              ) {
                newOptions.push(option)
                preScore = option.score
              }
            })
            this.options = newOptions
          }
        })
        .catch((error) => {
          console.log("[ERROR] in afterVote: ", error)
        })
    },
  },
}

// 質問の情報・選択肢をまとめて取得する
async function getQuestionData(authId, subjectId) {
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
      console.log("[ERROR] in getQuestionData (options): ", error)
    })
  const optionsAry = []
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    optionsAry.push({ id: doc.id, title: data.title, score: 0 })
  })

  // 質問に回答済みか否かを取得
  const votedSnapshot = await db
    .collection("votes")
    .where("authId", "==", authId)
    .where("subjectId", "==", subjectId)
    .get()
    .catch((error) => {
      console.log("[ERROR] in getQuestionData (votedSnapshot): ", error)
    })
  let tmpVotedDocId = null
  if (votedSnapshot.size > 0) {
    votedSnapshot.forEach((doc) => {
      tmpVotedDocId = doc.id
    })
  }

  return {
    createdMe: authId === docData.authId,
    isCloseVoted: docData.isCloseVoted,
    isPublic: docData.isPublic,
    options: optionsAry,
    subjectData: docData,
    title: docData.title,
    visibleOrder: docData.visibleOrder,
    votedDocId: tmpVotedDocId,
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
