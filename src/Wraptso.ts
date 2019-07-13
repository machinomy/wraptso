import * as fs from "fs";
import ContractTemplate from "./ContractTemplate";
import * as glob from "glob";
import * as mkdirp from "mkdirp";
import * as path from "path";

export default class Wraptso {
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

    let fileNames = glob.sync(this.pattern);
    if (fileNames.length) {
      fileNames.forEach(fileName => {
        let transformer = new ContractTemplate(
          this.templatesDir,
          this.outputDir
        );
        transformer.render(fileName);
      });
    } else {
      throw new Error(`No Truffle Contract artifact found at ${this.pattern}`);
    }
  }
}
