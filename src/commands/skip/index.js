import vlc from "lib/vlc"

export default {
  permission: "mod",
  async handle() {
    const result = await vlc.sendCommand("pl_next")
    if (!result) {
      return "Der Video Player scheint gerade nicht ansprechbar zu sein."
    }
    return "Skippie!"
  },
}