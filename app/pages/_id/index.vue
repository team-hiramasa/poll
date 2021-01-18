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
      投票結果<span v-if="isCloseVoted === true">（カッコ内は得数数）</span>
      <br /><br />
      <ul>
        <li v-for="option in options" :key="option.id" class="list-option">
          {{ option.rank }}位 … {{ option.title }}
          <span v-if="isCloseVoted === true">（{{ option.score }}）</span>
          <div v-if="option.comments && option.comments.length > 0">
            <ul>
              <span>コメント：</span>
              <li v-for="comment in option.comments" :key="comment.id">
                「{{ comment }}」
              </li>
            </ul>
          </div>
          <br />
        </li>
      </ul>
      <!-- TODO: 下記リンク先を画面遷移なしで出来ればそうする -->
      <br />
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
    const options = questionData.options
    // 質問タイトルが未設定か、選択肢がないor一つしかない場合、トップページに戻る
    if (questionData.title === "" || options.length < 2) {
      location.href = "/"
    }
    return {
      ...questionData,
      authId: currentAuthId, // 同じキーの値を上書き
      options, // 選択肢の配列. 得票数も格納する
      subjectId: currentSubjectId,
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
      if (this.createMe || this.isPublic) {
        // 自分の質問 or すぐ結果を表示する設定なら, 投票結果を取得＆表示する
        this.showResult = true
        this.getResult()
      } else {
        // トップ（投票一覧）に戻る
        location.href = "/"
      }
    },

    // 投票結果を選択肢配列に反映する. この中でコメントも格納する
    getResult() {
      db.collection("votes")
        .where("subjectId", "==", this.subjectId)
        .get()
        .then((docs) => {
          // 選択肢IDごとにコメント、得票数用の一時オブジェクトをそれぞれ作成
          // TODO: 長いので別関数にする
          const comments = {}
          const scores = {}
          docs.forEach((doc) => {
            const docData = doc.data()
            const comment = docData.comment
            const optionId = docData.optionId
            if (comment) {
              if (!comments[optionId]) {
                comments[optionId] = {}
              }
              comments[optionId][comment] = ""
            }
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
          // 順位を計算して格納する
          let rank = 1
          let preScore = null
          this.options = this.options.filter((option) => {
            if (option.score < preScore) {
              rank++
            }
            option.rank = rank
            preScore = option.score
            if (this.visibleOrder > 0 && rank > this.visibleOrder) {
              // visibleOrder指定があり(0より大きい)、かつrankがvisibleOrderを超えたら
              // 表示しないので、ここで要素を返さない
            } else {
              // 表示する選択肢を返す. この時コメントのオブジェクトを配列で格納する
              option.comments = Object.keys(comments[option.id])
              return option
            }
          })
        })
        .catch((error) => {
          console.log("[ERROR] in afterVote: ", error)
        })
    },
  },
}

// 質問の情報・選択肢をまとめて取得する
// 返すオブジェクトを最初に作ってから要素を足している (その方が分かりやすいかと)
async function getQuestionData(authId, subjectId) {
  let returnObject = {}
  const questionDoc = await db
    .collection("subjects")
    .doc(subjectId)
    .get()
    .catch((error) => {
      console.log("[ERROR] in getting documents: ", error)
    })

  // 存在しないIDの質問がリクエストされた場合、トップに戻る
  if (!questionDoc.exists) {
    location.href = "/"
  } else {
    returnObject = questionDoc.data()
  }

  // 質問の選択肢を取得
  const querySnapshot = await db
    .collection("options")
    .where("subjectId", "==", subjectId)
    .get()
    .catch((error) => {
      console.log("[ERROR] in getQuestionData (options): ", error)
    })

  // 表示・操作用に選択肢の配列を作成
  const options = []
  querySnapshot.forEach((doc) => {
    options.push({ ...doc.data(), id: doc.id, score: 0 })
  })

  // 選択肢をソート (orderがあればその順、なければタイトル順)
  options.sort((a, b) => {
    if (a.order && b.order) {
      return a.order > b.order
    } else {
      return a.title > b.title
    }
  })

  // 選択肢の配列を、返すオブジェクトに追加
  returnObject = {
    ...returnObject,
    options,
  }

  // 質問に回答済みか否かを取得
  // 回答済みなら、votesのドキュメントIDをvotedDocIdとして返すオブジェクトに追加
  const votedSnapshot = await db
    .collection("votes")
    .where("authId", "==", authId)
    .where("subjectId", "==", subjectId)
    .get()
    .catch((error) => {
      console.log("[ERROR] in getQuestionData (votedSnapshot): ", error)
    })
  let votedDocId = null
  if (votedSnapshot.size > 0) {
    votedSnapshot.forEach((doc) => {
      votedDocId = doc.id
    })
  }
  returnObject = {
    ...returnObject,
    votedDocId,
  }

  return returnObject
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
