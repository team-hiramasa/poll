import { Middleware, Context } from "@nuxt/types"
const middleware: Middleware = ({ app: { $accessor } }: Context) => {
  if (!$accessor.user.isAuth) {
    $accessor.user.signInAnonymously()
  }
  console.log("Your uid is " + $accessor.user.uid + ".")
}
export default middleware
