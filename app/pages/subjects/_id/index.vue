<template>
  <v-app>
    <v-app-bar fixed app>
      <v-tabs class="elevation-2" dark centered="centered" fixed-tabs>
        <v-tabs-slider />
        <v-tab>
          <span v-if="showResult === false">
            質問に投票する
          </span>
          <span v-else>
            投票結果
            <span v-if="isCloseVoted === true">（カッコ内は得数数）</span>
          </span>
        </v-tab>
      </v-tabs>
    </v-app-bar>
    <div class="mainform">
      <v-form v-if="showResult === false">
        <v-row> {{ title }} </v-row>
        <v-radio-group v-model="checkedOption">
          <v-radio
            v-for="option in options"
            :key="option.id"
            :label="`${option.title}`"
            :value="option.id"
            name="option"
          />
        </v-radio-group>
        <v-textarea
          v-model="voteComment"
          class="comment"
          label="コメント(任意)"
          rows="2"
        />
      </v-form>
      <v-layout v-else class="result">
        <v-flex v-for="(rank, index) in ranking" :key="index">
          {{ index + 1 }}位
          <ul>
            <li v-for="option in rank" :key="option.id">
              {{ option.title }}
              <span v-if="isCloseVoted === true">（{{ option.score }}）</span>
              <div>
                <ul class="comments">
                  <li v-for="comment in option.comments" :key="comment.id">
                    {{ comment }}
                  </li>
                </ul>
                <ul v-if="!option.comments">
                  （コメントなし）
                </ul>
              </div>
            </li>
          </ul>
        </v-flex>
        <ul>
          <!-- なぜかoptionsを使わないとrankingを使うループが回らない -->
          <!-- TODO: 後で詳細調査 -->
          <li
            v-for="option in options"
            :key="option.id"
            style="display: none;"
          />
        </ul>
      </v-layout>
      <v-layout my-5 text-center>
        <v-flex>
          <v-btn v-if="showResult === false" @click="vote">
            投票する
          </v-btn>
        </v-flex>
        <v-flex>
          <v-btn @click="returnTop">
            最初に戻る
          </v-btn>
        </v-flex>
      </v-layout>
    </div>
  </v-app>
</template>

<script>
import Vue from "vue"
import firebase from "~/plugins/firebase.ts"

const db = firebase.firestore()

export default Vue.extend({
  async asyncData({ params }) {
    const currentAuthId = firebase.auth().currentUser.uid
    const currentSubjectId = params.id
    const questionData = await getQuestionData(currentAuthId, currentSubjectId)
    const options = questionData.options
    const ranking = []
    // 質問タイトルが未設定か、選択肢がないor一つしかない場合、トップページに戻る
    if (questionData.title === "" || options.length < 2) {
      location.href = "/"
    }
    return {
      ...questionData,
      authId: currentAuthId, // 同じキーの値を上書き
      options, // 選択肢の配列. 得票数も格納する
      ranking, // 投票結果の順位別に選択肢をまとめた配列
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
      } else {
        // TODO: 選択肢を未選択の場合にメッセージ出す
        // alert("選択肢が未選択")
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
          // 選択肢IDごとに別メソッドで処理
          this.getResultDetail(docs)
        })
        .catch((error) => {
          console.log("[ERROR] in afterVote: ", error)
        })
    },

    // 選択肢ごとにコメント、得票数の一時オブジェクトを作成. 最後に別メソッドへ渡す
    getResultDetail(docs) {
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
      this.setResultObject(comments, scores)
    },

    // コメント、得票数の情報をグローバルなオブジェクトに入れる
    setResultObject(comments, scores) {
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
          const comment = comments[option.id]
          if (comment) {
            option.comments = Object.keys(comment)
          }
          return option
        }
      })
      // 順位別のオブジェクトに格納
      this.options.forEach((option) => {
        const rankIndex = option.rank - 1
        if (!this.ranking[rankIndex]) {
          this.ranking[rankIndex] = []
        }
        this.ranking[rankIndex].push(option)
      })
      console.log(this.ranking) // for debug
    },

    // ボタン「最初へ戻る」用
    returnTop() {
      location.href = "/"
    },
  },
})

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
.mainform {
  margin: 25px auto 0;
  width: 480px;
}
.comments {
  list-style-type: none;
  li:before {
    content: "💬";
  }
}
</style>
