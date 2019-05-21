import youtube from "youtube-api"

youtube.authenticate({
  type: "oauth",
  refresh_token: require("C:/Users/Jaid/youtubeToken.json").refresh_token,
  client_id: process.env.YOUTUBE_CLIENT_ID,
  client_secret: process.env.YOUTUBE_CLIENT_SECRET,
  redirect_url: "http://localhost",
})

export default youtube