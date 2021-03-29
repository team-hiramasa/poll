import { actionTree, mutationTree } from "typed-vuex"

import firebase from "~/plugins/firebase"

export type UserType = {
  isAuth: boolean
  uid: string
}

export type EmailKeyType = {
  email: string
  password: string
}

export const state = (): UserType => ({
  isAuth: false,
  uid: "",
})
export type RootState = ReturnType<typeof state>

export const mutations = mutationTree(state, {
  setSignInState: (state, user) => {
    state.isAuth = !!user
    state.uid = (user && user.uid) || ""
    console.log("Your uid is " + state.uid + ".")
  },
})

export const actions = actionTree(
  { state, mutations },
  {
    async signInAnonymously({ commit }) {
      await firebase
        .auth()
        .signInAnonymously()
        .then((result) => {
          commit("setSignInState", result.user)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async signOut({ commit }) {
      await firebase
        .auth()
        .signOut()
        .then(() => {
          commit("setSignInState", false)
        })
    },
  }
)
