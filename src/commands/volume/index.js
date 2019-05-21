import vlc from "lib/vlc"
import {isInteger} from "lodash"

export default {
  permission: "mod",
  async handle({positionalArguments}) {
    const vlcState = await vlc.getState()
    if (!vlcState) {
      return "Kein Lebenszeichen vom Video Player."
    }
    const currentVolume = Math.floor(vlcState.volume / 3.2)
    if (positionalArguments[0] |> isInteger) {
      const chosenVolume = Math.floor(positionalArguments[0] * 3.2)
      if (Number(positionalArguments[0]) === currentVolume) {
        return `Die Lautstärke wurde von ${currentVolume}% auf ${currentVolume}... Moment. Am I a joke to you?`
      }
      await vlc.sendCommand("volume", {val: chosenVolume})
      const verb = positionalArguments[0] > currentVolume ? "angehoben" : "gesenkt"
      return `Die Lautstärke wurde von ${currentVolume}% auf ${positionalArguments[0]}% ${verb}.`
    }
    return `Die aktuelle Lautstärke ist ${currentVolume}%.`
  },
}