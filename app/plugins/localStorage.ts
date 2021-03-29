import { Context } from "@nuxt/types"
import createPersistedState from "vuex-persistedstate"

export default ({ store }: Context) => {
  createPersistedState({
    key: "hiramasa-poll",
    paths: ["user"],
  })(store)
}
