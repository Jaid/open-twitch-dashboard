import open from "open"
import yargs from "yargs"
import execa from "execa"

const url = "https://twitch.tv/dashboard"

const job = async ({kiosk, userDataDir}) => {
  if (kiosk) {
    const parameters = ["--app", url]
    if (userDataDir) {
      parameters.push("--user-data-dir", userDataDir)
    }
    await execa("chrome", parameters, {
      detached: true,
    })
  } else {
    await open(url)
  }
  process.exit(0)
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
}

yargs
  .scriptName(_PKG_NAME)
  .version(_PKG_VERSION)
  .command("$0", "Opens twitch.tv/dashboard in a browser", builder, job).argv