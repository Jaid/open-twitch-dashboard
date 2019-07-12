import path from "path"

import yargs from "yargs"
import execa from "execa"

const job = ({kiosk, userDataDir, chromePath, url}) => {
  const parameters = []
  if (userDataDir) {
    parameters.push("--user-data-dir", userDataDir)
  }
  if (kiosk) {
    parameters.push("--chrome-frame", "--disable-features=TranslahteUI", `--app=${url}`)
  } else {
    parameters.push(url)
  }
  execa.sync(chromePath, parameters, {
    detached: true,
  })
}

const builder = {
  kiosk: {
    type: "boolean",
    default: false,
    description: "Opens Chrome in kiosk mode",
  },
  "user-data-dir": {
    type: "string",
    description: "Path to the Chrome user data directory",
  },
  "chrome-path": {
    type: "string",
    default: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe" |> path.resolve,
    description: "Path to Chrome binary",
  },
  url: {
    type: "string",
    default: "https://twitch.tv/dashboard",
    description: "URL to open",
  },
}

yargs
  .scriptName(_PKG_NAME)
  .version(_PKG_VERSION)
  .command("$0", "Opens twitch.tv/dashboard in a browser", builder, job).argv