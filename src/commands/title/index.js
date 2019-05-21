import got from "got"
import afkManager from "lib/afkManager"

export default {
  async handle({say, streamerClient, combinedArguments: newTitle}) {
    await afkManager.setTitle(newTitle)
    say(`Dieser Stream wurde umgetauft zu "${newTitle}". Amen.`)
  },
}