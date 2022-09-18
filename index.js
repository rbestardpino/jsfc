#! /usr/bin/env node
const { program } = require("commander")
const meta = require("./package.json")
const { existsSync, readFileSync, writeFileSync, mkdirSync } = require("fs")
const compile = require("./compiler")

console.time("Compile time")

program
  .name(meta.name)
  .version(meta.version)
  .description(meta.description)
  .usage("-i <input> -o <output>")

program
  .requiredOption("-i, --input <path>", "Path to the file you want to compile")
  .option(
    "-o, --output <path>",
    "Path where the compiled file will be outputted",
    "./output/index.js"
  )

program.parse()

const options = program.opts()

if (!existsSync(options.input)) {
  console.error(`Input file "${options.input}" does not exist.`)
  process.exit(1)
}

const outputDir = options.output.split("/").slice(0, -1).join("/")
if (outputDir && !existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true })
}

writeFileSync(options.output, compile(readFileSync(options.input).toString()))

console.timeEnd("Compile time")
