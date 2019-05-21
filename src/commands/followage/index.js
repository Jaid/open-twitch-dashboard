import {getFollowMoment, userNameToDisplayName} from "lib/twitchApi"

const formatDate = momentDate => momentDate.format("DD.MM.YYYY [um] HH:mm")

export default {
  async handle({streamerClient, senderUserName, senderDisplayName, positionalArguments}) {
    if (positionalArguments[0]) {
      const compareUserName = positionalArguments[0]
      const [compareDisplayName, senderFollowMoment, compareFollowMoment] = await Promise.all([
        userNameToDisplayName(streamerClient, compareUserName),
        getFollowMoment(streamerClient, senderUserName),
        getFollowMoment(streamerClient, compareUserName),
      ])
      if (!senderFollowMoment && !compareFollowMoment) {
        return "Ihr seid beide keine Follower! Heiratet doch! DansGame"
      }
      if (!senderFollowMoment && compareFollowMoment) {
        return `${compareDisplayName} hat sich am ${compareFollowMoment |> formatDate} Uhr zum Follower transformiert. Das ist ein Akt der Persönlichkeitsentwicklung, der dir noch bevorsteht, ${senderDisplayName}.`
      }
      if (senderFollowMoment && !compareFollowMoment) {
        return `${senderDisplayName}, du hast dich am ${senderFollowMoment |> formatDate} Uhr zum Follower gemacht. Oh, und da hinten ist ${compareDisplayName}. Den kannst du ignorieren. Oder bekehren.`
      }
      if (senderFollowMoment.isBefore(compareFollowMoment.clone().subtract(7, "days"))) {
        return `Am ${compareFollowMoment |> formatDate} ist ${compareDisplayName} Follower geworden, du hingegen schon am ${senderFollowMoment |> formatDate}, ${senderDisplayName}. Knappes Höschen also!`
      }
      if (senderFollowMoment.isBefore(compareFollowMoment)) {
        return `Am ${compareFollowMoment |> formatDate} ist ${compareDisplayName} Follower geworden, du hingegen schon am ${senderFollowMoment |> formatDate}, ${senderDisplayName}, du frühes Vöglein!`
      }
      if (compareFollowMoment.isBefore(senderFollowMoment.clone().subtract(7, "days"))) {
        return `Am ${compareFollowMoment |> formatDate} ist ${compareDisplayName} Follower geworden, du hingegen erst am ${senderFollowMoment |> formatDate}, ${senderDisplayName}. Ist aber knapp, vielleicht holst du ja noch auf. Keepo`
      }
      return `Am ${compareFollowMoment |> formatDate} ist ${compareDisplayName} Follower geworden, du hingegen erst am ${senderFollowMoment |> formatDate}, ${senderDisplayName}!`
    } else {
      const followMoment = await getFollowMoment(streamerClient, senderUserName)
      if (!followMoment) {
        return `${senderDisplayName}... NotLikeThis`
      }
      return `Für den Follow hast du dich ${followMoment.fromNow()} entschieden, ${senderDisplayName}, am ${followMoment |> formatDate} Uhr.`
    }
  },
}