import vlc from "lib/vlc"
import pify from "pify"
import youtube from "lib/youtube"

export default {
  permission: "mod",
  minimumArguments: 1,
  async handle({combinedArguments}) {
    const info = await vlc.getMetaForVideo()
    if (!info) {
      return "Das habe ich nicht hingekriegt."
    }
    if (info.extractor !== "youtube") {
      return "Beim abgespielten Video scheint es sich nicht um ein YouTube-Video zu handeln."
    }
    await pify(youtube.commentThreads.insert)({
      part: "snippet",
      resource: {
        snippet: {
          videoId: info.id,
          topLevelComment: {
            snippet: {
              textOriginal: combinedArguments,
            },
          },
        },
      },
    })
    return `Comment unter dem Video "${info.fulltitle || info.title}" ist raus!`
  },
}