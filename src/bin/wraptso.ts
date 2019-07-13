#!/usr/bin/env node

import yargs from "yargs";
import Wraptso from "../index";

export interface T {
  contracts: string;
  o: string;
  output: string;
}

const args = (yargs as yargs.Argv<T>)
  .scriptName("wraptso")
  .usage("$0 <contracts>", "Prepare wrappers for Solidity contracts", yargs => {
    return yargs.positional("contracts", {
      describe: "Glob to Truffle artifacts for Solidity files",
      type: "string"
    });
  })
  .option("output", {
    describe: "Output folder for generated files",
    alias: "o",
    demand: true
  })
  .help()
  .showHelpOnFail(true)
  .parse();

const pattern = args.contracts;
const outputDir = args["output"] as string;
const wraptso = new Wraptso(pattern, outputDir);

wraptso
  .run()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
