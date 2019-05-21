import moment from "lib/moment"
import {template} from "lodash"
import {userNameToDisplayName} from "lib/twitchApi"

const vips = require("./vips.yml")

const getGreeting = () => {
  const hour = moment().hour()
  if (hour >= 21) {
    return "HeyGuys Guten Tag"
  } else if (hour >= 18) {
    return "HeyGuys Guten Abend"
  } else if (hour >= 13) {
    return "HeyGuys Guten Nachmittag"
  } else if (hour >= 11) {
    return "HeyGuys Guten Mittag"
  } else if (hour >= 9) {
    return "HeyGuys Guten Vormittag"
  } else {
    return "HeyGuys Guten Morgen"
  }
}

export default {
  async handle({isVip, senderDisplayName, senderUserName, positionalArguments, streamerClient}) {
    const greeting = getGreeting()
    let userName
    let displayName
    if (positionalArguments[0]) {
      userName = positionalArguments[0].toLowerCase()
      displayName = await userNameToDisplayName(streamerClient, userName)
    } else {
      userName = senderUserName
      displayName = senderDisplayName
    }
    if (vips[userName]) {
      return template(vips[userName])({greeting})
    }
    const vipString = isVip ? "höchstgeachteter " : ""
    return `${greeting}, ${vipString}${displayName}!`
  },
}