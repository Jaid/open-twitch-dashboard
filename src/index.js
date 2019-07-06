import open from "open"
import yargs from "yargs"
import execa from "execa"

const url = "https://twitch.tv/dashboard"

const job = async ({kiosk}) => {
  if (kiosk) {
    await execa("chrome", ["--app", url], {
      cleanup: false,
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
}

yargs
  .scriptName(_PKG_NAME)
  .version(_PKG_VERSION)
  .command("$0", "Opens twitch.tv/dashboard in a browser", builder, job).argv