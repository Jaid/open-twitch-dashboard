import stringArgv from "string-argv"
import minimist from "minimist"
import {isString} from "lodash"

const commandRegex = /^(?<prefix>!)(?<commandName>[\da-z]+)(?<afterCommandName>\s*(?<commandArguments>.*))?/i

const commandsRequire = require.context("./commands/", true, /index\.js$/)
const commands = commandsRequire.keys().reduce((state, value) => {
  const commandName = value.match(/\.\/(?<key>[\da-z]+)\//i).groups.key
  state[commandName] = commandsRequire(value).default
  return state
}, {})

export default (message, msg, streamerClient, botClient, chatClient, say) => {
  const parsedCommand = commandRegex.exec(message.trim())
  if (parsedCommand === null) {
    return
  }
  const senderDisplayName = msg.userInfo.displayName || msg.userInfo.name
  const {commandName} = parsedCommand.groups
  let commandArguments
  let positionalArguments
  if (parsedCommand.groups.commandArguments) {
    commandArguments = parsedCommand.groups.commandArguments |> stringArgv |> minimist
    positionalArguments = commandArguments._
  }
  const command = commands[commandName]
  if (!command) {
    say(`Verstehe ich jetzt nicht, ${senderDisplayName}! Alle Befehle sind in den Panels unter dem Stream beschrieben.`)
    return
  }
  if (command.requiredArguments) {
    if (!commandArguments) {
      say(`${senderDisplayName}, dieser Befehl kann nicht ohne Arguments verwendet werden!`)
      return
    }
    const givenArgumentsLength = positionalArguments.length
    if (command.requiredArguments > givenArgumentsLength) {
      say(`${senderDisplayName}, dieser Befehl benötigt ${command.requiredArguments} Arguments!`)
      return
    }
  }
  const isVip = msg.userInfo.badges.get("vip") === "1"
  if (msg.userInfo.userId !== "65887522") {
    if (command.permission === "sub-or-vip" && !msg.userInfo.isSubscriber && !isVip && !msg.userInfo.isMod) {
      say(`${senderDisplayName}, für diesen Befehl musst du Moderator, Subscriber oder VIP sein!`)
      return
    }
    if (command.permission === "mod" && !msg.userInfo.isMod) {
      say(`${senderDisplayName}, für diesen Befehl musst du Moderator sein!`)
      return
    }
  }
  command.handle({
    msg,
    say,
    streamerClient,
    botClient,
    chatClient,
    commandArguments,
    senderDisplayName,
    isVip,
    positionalArguments: positionalArguments || [],
    combinedArguments: parsedCommand?.groups?.commandArguments,
    senderUserName: msg.userInfo.userName,
  }).then(returnValue => {
    if (returnValue |> isString) {
      say(returnValue)
    }
  }).catch(error => {
    say(`Oh, ${senderDisplayName}, da hat irgendetwas nicht geklappt. (${error?.message || error})`)
  })
}