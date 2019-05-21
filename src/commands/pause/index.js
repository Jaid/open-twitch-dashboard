import moment from "lib/moment"
import vlc from "lib/vlc"

export default {
  permission: "mod",
  async handle() {
    const vlcState = await vlc.getState()
    if (!vlcState) {
      return "Kein Lebenszeichen vom Video Player."
    }
    const durationString = moment.duration(vlcState.time, "seconds").format()
    const command = vlcState.state === "playing" ? "pl_forcepause" : "pl_play"
    const answer = vlcState.state === "playing" ? `Pausiert bei ${durationString}, Bruder! Jetzt hast du deine Ruhe.` : `Geht heiter weiter an der Stelle ${durationString}!`
    await vlc.sendCommand(command)
    return answer
  },
}