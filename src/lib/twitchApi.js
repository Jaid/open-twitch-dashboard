import moment from "lib/moment"

const channelId = "65887522"

export const userNameToDisplayName = async (client, userName) => {
  const profile = await client.helix.users.getUserByName(userName)
  return profile?.displayName || profile?.name || userName
}

export const getFollowMoment = async (client, userName) => {
  const user = await client.helix.users.getUserByName(userName)
  const followResult = await user.getFollowTo(channelId)
  if (followResult === null) {
    return false
  }
  return moment(followResult.followDate).locale("de")
}

export const getMyStream = async client => {
  return client.kraken.streams.getStreamByChannel(channelId)
}

export const setCategory = async (client, game) => {
  await client.kraken.channels.updateChannel(channelId, {game})
}

export const setTitle = async (client, title) => {
  await client.kraken.channels.updateChannel(channelId, {
    status: title.trim(),
  })
}