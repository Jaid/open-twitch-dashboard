import vlc from "lib/vlc"
import pify from "pify"
import youtube from "lib/youtube"

export default {
  permission: "mod",
  async handle() {
    const info = await vlc.getMetaForVideo()
    if (!info) {
      return "Das habe ich nicht hingekriegt."
    }
    if (info.extractor !== "youtube") {
      return "Beim abgespielten Video scheint es sich nicht um ein YouTube-Video zu handeln."
    }
    await pify(youtube.videos.rate)({
      id: info.id,
      rating: "dislike",
    })
    return `Dislike für dieses Kackvideo "${info.fulltitle || info.title}" ist raus!`
  },
}