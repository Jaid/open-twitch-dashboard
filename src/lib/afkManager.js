import {setTitle, getMyStream} from "lib/twitchApi"
import moment from "lib/moment"
import humanizeDuration from "lib/humanizeDuration"

const extractTitleRegex = /(?<nontitle>(?<prefix>.*?)?\s*(?<emoji>💜)\s*)?(?<title>.*)/

const afkToleranceMinutes = 2

const AfkManager = class {

  afkMessage = null

  afkStart = null

  afkEnd = null

  title = null

  constructor() {
    setInterval(() => {
      if (this.isAfk()) {
        this.setTitle()
      }
    }, 30000)
  }

  isAfk() {
    return this.afkMessage !== null
  }

  getRemainingTime() {
    return this.afkEnd - Date.now()
  }

  getRemainingTimeString() {
    const remainingTimeMs = this.getRemainingTime()
    if (remainingTimeMs <= 60 * 1000) {
      return ""
    }
    const remainingTimeString = moment.duration(remainingTimeMs, "ms").format("h[h] m[m]")
    return `, ${remainingTimeString}`
  }

  getTitlePrefix() {
    if (!this.isAfk()) {
      return ""
    }
    return `[${this.afkMessage}${this.getRemainingTimeString()}] `
  }

  async setTitle(title) {
    if (title) {
      this.title = title
    }
    if (!this.title) {
      const {channel} = await getMyStream(this.twitchClient)
      this.title = extractTitleRegex.exec(channel.status).groups.title
    }
    await setTitle(this.twitchClient, `${this.getTitlePrefix()}💜 ${this.title}`)
  }

  async activate(durationSeconds, message) {
    this.afkStart = Date.now()
    this.afkEnd = this.afkStart + durationSeconds * 1000
    this.afkMessage = message
    await this.setTitle()
    this.say(`Jaidchen geht jetzt mal weg für etwa ${(durationSeconds * 1000) |> humanizeDuration}. Als Nachricht hat er lediglich ein "${message}" hinterlassen.`)
  }

  async deactivate() {
    const remainingTime = this.getRemainingTime()
    const getComment = () => {
      if (remainingTime > (afkToleranceMinutes * 60 * 1000)) {
        return `Oh, der ist ja schon wieder da, ${remainingTime |> humanizeDuration} früher als angekündigt! KomodoHype`
      } else if (remainingTime > (-afkToleranceMinutes * 60 * 1000)) {
        return "Da ist er ja wieder! TPFufun"
      } else {
        return `"${this.afkMessage}", ja ja. Du wolltest doch eigentlich schon seit ${remainingTime |> Math.abs |> humanizeDuration} wieder da sein. Jaidchen,wo bist du gewesen? HotPokket`
      }
    }
    this.afkStart = null
    this.afkEnd = null
    this.afkMessage = null
    await this.setTitle()
    this.say(getComment())
  }

  init(twitchClient, say) {
    this.twitchClient = twitchClient
    this.say = say
    this.setTitle()
  }

}

export default new AfkManager