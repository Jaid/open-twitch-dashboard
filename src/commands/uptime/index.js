import moment from "lib/moment"

export default {
  async handle({chatClient, senderDisplayName}) {
    const info = await chatClient._twitchClient.helix.streams.getStreamByUserName("jaidchen")
    if (info?.type !== "live") {
      return "Jaidchen ist gerade nicht live!"
    }
    const nowMoment = moment()
    const startMoment = moment(info.startDate)
    const duration = moment.duration(nowMoment.diff(startMoment))
    const hours = duration.get("hours")
    const minutes = duration.get("minutes")
    let durationString
    if (hours < 1) {
      if (minutes === 1) {
        durationString = "einer Minute"
      } else {
        durationString = `${minutes} Minuten`
      }
    } else {
      const restMinutes = minutes % 60
      let minutesString = ""
      if (restMinutes === 1) {
        minutesString = " und einer Minute"
      } else if (restMinutes > 1) {
        minutesString = ` und ${restMinutes} Minuten`
      }
      let hoursString
      if (hours === 1) {
        hoursString = "einer Stunde"
      } else {
        hoursString = `${hours} Stunden`
      }
      durationString = hoursString + minutesString
    }
    let dayString = ""
    if (nowMoment.day() !== startMoment.day()) {
      dayString = " gestern"
    }
    return `VoHiYo ${senderDisplayName}, der Stream ging vor ${durationString} live, das war${dayString} um ${startMoment.format("HH:mm")} Uhr.`
  },
}