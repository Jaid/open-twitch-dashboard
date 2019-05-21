import vlc from "lib/vlc"

export default {
  async handle() {
    const vlcState = await vlc.getState()
    if (!vlcState) {
      return "Kein Lebenszeichen vom Video Player."
    }
    if (vlcState.currentplid === -1) {
      return "Gerade läuft nichts."
    }
    const videoFile = await vlc.getCurrentVideoPath()
    if (!videoFile) {
      return "Das gerade abgespielte Video finde ich nicht im Dateisystem, sorry!"
    }
    const info = await vlc.getMetaForVideo(videoFile)
    if (!info) {
      return "Dazu finde ich in meinen Unterlagen keine brauchbaren Informationen, sorry!"
    }
    let url
    if (info.extractor === "youtube") {
      url = `https://youtu.be/${info.id}?t=${vlcState.time}`
    } else {
      url = info.webpage_url
    }
    return `PopCorn ${url}`
  },
}