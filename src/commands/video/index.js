import moment from "lib/moment"
import fsp from "@absolunet/fsp"
import millify from "millify"
import filesize from "filesize"
import vlc from "lib/vlc"

export default {
  async handle({senderDisplayName}) {
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
    const properties = []
    if (info.height && info.fps) {
      properties.push(`${info.height}p${info.fps}`)
    }
    if (info.age_limit > 0) {
      properties.push(`freigegeben ab ${info.age_limit} Jahren`)
    }
    if (info.duration) {
      properties.push(`${moment.duration(info.duration, "seconds").format()} Laufzeit`)
    }
    const {size} = await fsp.stat(videoFile)
    if (size > 1000) {
      properties.push(filesize(size, {round: 0}))
    }
    if (info.view_count) {
      properties.push(`${millify(info.view_count, {precision: 0})} Views`)
    }
    if (info.like_count && info.dislike_count) {
      const ratio = Math.floor((info.like_count / (info.like_count + info.dislike_count)) * 100)
      properties.push(`${millify(info.like_count, {precision: 0})} Likes (${ratio}%)`)
    }
    if (info.upload_date) {
      properties.push(`${moment(info.upload_date).locale("de").fromNow()} erschienen`)
    }
    const currentTime = moment.duration(vlcState.time, "seconds").format()
    return `PopCorn ${senderDisplayName}, gerade läuft Stelle ${currentTime} des Videos "${info.fulltitle || info.title}" von ${info.uploader}. ${properties.join(", ")}.`
  },
}