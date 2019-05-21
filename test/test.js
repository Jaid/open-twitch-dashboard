import path from "path"
import fs from "fs"

const indexModule = process.env.MAIN ? path.resolve(__dirname, "..", process.env.MAIN) : path.join(__dirname, "..", "src")
const {default: open-twitch-dashboard, parallel} = require(indexModule)

it("should run with 1 argument", () => {
  const result = open-twitch-dashboard(["a", "b"])
  expect(result).toEqual({
    a: null,
    b: null,
  })
})

it("should run with an integer as second argument", () => {
  const result = open-twitch-dashboard(["a", "b"], 7)
  expect(result).toEqual({
    a: 7,
    b: 7,
  })
})

it("should run with a function as second argument", () => {
  const valueGenerator = (key, index) => `${index + 1}-${key}-x`
  const result = open-twitch-dashboard(["a", "b"], valueGenerator)
  expect(result).toEqual({
    a: "1-a-x",
    b: "2-b-x",
  })
})

it("should run in parallel", async () => {
  const valueGenerator = (key, index) => `${index + 1}-${key}-x`
  const result = await parallel(["a", "b"], valueGenerator)
  expect(result).toEqual({
    a: "1-a-x",
    b: "2-b-x",
  })
})

it("should call fs functions in parallel", async () => {
  const keys = ["license", "readme", "package", ".travis", "not-here"]
  const valueGenerator = async name => {
    const files = await fs.promises.readdir(path.resolve(__dirname, ".."))
    for (const file of files) {
      if (file.startsWith(`${name}.`)) {
        const stat = await fs.promises.stat(path.resolve(__dirname, "..", file), "utf8")
        return stat.size
      }
    }
    return null
  }
  const result = await parallel(keys, valueGenerator)
  expect(keys).toEqual(["license", "readme", "package", ".travis", "not-here"])
  expect(Object.keys(result)).toEqual(keys)
  expect(result).toMatchObject({
    license: expect.any(Number),
    readme: expect.any(Number),
    package: expect.any(Number),
    ".travis": expect.any(Number),
    "not-here": null,
  })
})