import got from "got"
import {isEmpty, isString} from "lodash"
import moment from "moment"

import startDate from "./startDate"

const processedIds = new Set

const run = async say => {
  const {body: result} = await got("https://api.travis-ci.com/builds", {
    json: true,
    headers: {
      "Travis-API-Version": 3,
      Authorization: `token ${process.env.TRAVIS_TOKEN}`,
    },
  })
  const tagBuilds = result.builds.filter(({id, tag, finished_at}) => tag?.["@type"] === "tag" && isString(finished_at) && !processedIds.has(id))
  if (tagBuilds |> isEmpty) {
    return
  }
  for (const build of tagBuilds) {
    processedIds.add(build.id)
    if (moment(build.finished_at).isSameOrBefore(startDate)) {
      continue
    }
    const getStateString = () => {
      if (build.state === "passed") {
        return "PartyHat Build abgeschlossen"
      }
      if (build.state === "canceled") {
        return "ItsBoshyTime Build abgebrochen"
      }
      if (build.state === "failed") {
        return "ItsBoshyTime Build fehlgeschlagen"
      }
      return "ItsBoshyTime Build aus unbekannten Gründen beendet"
    }
    say(`${getStateString()}: ${build.repository.name} ${build.tag.name}`)
  }
}

export default say => {
  setInterval(() => run(say), 10000)
}