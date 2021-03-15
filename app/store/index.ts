import {
  getAccessorType,
  getterTree,
  mutationTree,
  actionTree,
} from "typed-vuex"
import * as user from "~/store/user"
// Keep your existing vanilla Vuex code for state, getters, mutations, actions, plugins, etc.

export const state = () => ({})

export const getters = getterTree(state, {})

export const mutations = mutationTree(state, {})

export const actions = actionTree({ state, getters, mutations }, {})

// This compiles to nothing and only serves to return the correct type of the accessor
export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
  modules: {
    user,
  },
})
