import fs from "fs";
import { ContractTemplate } from "./ContractTemplate";
import glob from "glob";
import mkdirp from "mkdirp";
import path from "path";

export class Wraptso {
  templatesDir: string;
  outputDir: string;
  pattern: string;

  constructor(pattern: string, outputDir: string) {
    this.pattern = pattern;
    this.templatesDir = path.join(__dirname, "../templates");
    this.outputDir = outputDir;
  }

  async run(): Promise<void> {
    if (!fs.existsSync(this.outputDir)) {
      mkdirp.sync(this.outputDir);
    }

    const fileNames = glob.sync(this.pattern);
    if (fileNames.length == 0) {
      console.warn(`No Truffle Contract artifact found at ${this.pattern}`);
    }
    fileNames.forEach(fileName => {
      let transformer = new ContractTemplate(this.templatesDir, this.outputDir);
      transformer.render(fileName);
    });
  }
}
