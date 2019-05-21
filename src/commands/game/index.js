import {sample} from "lodash"
import {getMyStream, setCategory} from "lib/twitchApi"

const people = require("./people.txt").default.split("\n")
const shortcuts = require("./shortcuts.yml")

export default {
  permission: "mod",
  requiredArguments: 1,
  async handle({streamerClient, combinedArguments: newGame}) {
    const {game: currentGame} = await getMyStream(streamerClient)
    if (shortcuts[newGame]) {
      newGame = shortcuts[newGame]
    }
    if (newGame === currentGame) {
      return "Uff, da ändert sich nicht viel."
    }
    await setCategory(streamerClient, newGame)
    if (currentGame) {
      return `Die ${people |> sample}, die nur für ${currentGame} hier waren, sind jetzt herzlich ausgeladen, denn es geht weiter mit ${newGame}!`
    } else {
      return `Es geht weiter mit ${newGame}!`
    }
  },
}