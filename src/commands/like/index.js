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
      rating: "like",
    })
    return `Like für dieses geile Video "${info.fulltitle || info.title}" ist raus!`
    //   const credentialsString = await fsp.readFile("C:/Users/Jaid/googleClient.json", "utf8")
    //   const credentials = credentialsString |> JSON.parse
    //   const oauthClient = new google.auth.OAuth2({
    //     clientId: credentials.web.client_id,
    //     clientSecret: credentials.web.client_secret,
    //     redirectUri: "http://localhost:3000/oauth2callback",
    //   })
    //   const u = oauthClient.generateAuthUrl({
    //     access_type: "offline",
    //     scope: "https://www.googleapis.com/auth/youtube.force-ssl",
    //   })
    //   const server = http
    //     .createServer(async (req, res) => {
    //       try {
    //         if (req.url.indexOf("/oauth2callback") > -1) {
    //           const qs = new url.URL(req.url, "http://localhost:3000")
    //             .searchParams
    //           res.end("Authentication successful! Please return to the console.")
    //           const {tokens} = await oauthClient.getToken(qs.get("code"))
    //           oauthClient.credentials = tokens
    //           debugger
    //         }
    //       } catch (error) {
    //         debugger
    //       }
    //     })
    //     .listen(3000, () => {
    //     })

  //   debugger
  },
}