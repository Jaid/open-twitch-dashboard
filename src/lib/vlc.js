import got from "got"
import fastDecodeUriComponent from "fast-decode-uri-component"
import urlParse from "url-parse"
import fsp from "@absolunet/fsp"
import preventStart from "prevent-start"

const gotOptions = {
  auth: ":1",
  throwHttpErrors: false,
  retry: {
    retries: 1,
    errorCodes: ["ETIMEDOUT", " ECONNRESET", "EADDRINUSE", "EPIPE", "ENOTFOUND", "ENETUNREACH", "EAI_AGAIN"],
  },
  json: true,
  port: 8080,
}

const Vlc = class {

  async getState() {
    try {
      const {body} = await got("http://127.0.0.1/requests/status.json", gotOptions)
      return body
    } catch {
      return null
    }
  }

  async getPlaylist() {
    try {
      const {body: playlist} = await got("http://127.0.0.1/requests/playlist.json", gotOptions)
      return playlist.children.find(({name}) => name === "Playlist")
    } catch {
      return null
    }
  }

  async getCurrentVideo() {
    const state = await this.getState()
    const playlist = await this.getPlaylist()
    if (!state || !playlist) {
      return null
    }
    const playlistEntry = playlist.children.find(({id}) => Number(id) === state.currentplid)
    if (!playlistEntry) {
      return null
    }
    return playlistEntry
  }

  async getCurrentVideoPath() {
    const playlistEntry = await this.getCurrentVideo()
    if (!playlistEntry) {
      return null
    }
    const {pathname: urlPath} = playlistEntry.uri |> fastDecodeUriComponent |> urlParse
    const videoFile = preventStart(urlPath, "/")
    const videoFileExists = await fsp.pathExists(videoFile)
    if (!videoFileExists) {
      return null
    }
    return videoFile
  }

  async getMetaForVideo(videoFile) {
    if (!videoFile) {
      videoFile = await this.getCurrentVideoPath()
      if (!videoFile) {
        return null
      }
    }
    const metaFile = videoFile.replace(/\.(mp4|webm|mov|flv|mkv)$/i, ".info.json")
    const metaFileExists = await fsp.pathExists(metaFile)
    if (!metaFileExists) {
      return null
    }
    const info = await fsp.readJson(metaFile)
    return info
  }

  async sendCommand(command, query) {
    try {
      await got("http://127.0.0.1/requests/status.json", {
        ...gotOptions,
        query: {
          command,
          ...query,
        },
      })
      return true
    } catch {
      return null
    }
  }

}

export default new Vlc