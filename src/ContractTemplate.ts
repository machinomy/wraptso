import path from "path";
import fs from "fs";
import { Context, MethodAbi, EventAbi } from "./Context";
import * as helpers from "./helpers";
import { AbiItem } from "web3-utils";
const Handlebars = require("handlebars");

const ABI_TYPE_FUNCTION = "function";
const ABI_TYPE_EVENT = "event";

function isAbiFunction(abi: AbiItem): abi is MethodAbi {
  return abi.type === ABI_TYPE_FUNCTION;
}

function isAbiEvent(abi: AbiItem): abi is EventAbi {
  return abi.type === ABI_TYPE_EVENT;
}

export class ContractTemplate {
  handlebars: any;
  templatesDir: string;
  outputDir: string;
  private _template?: any;

  constructor(templatesDir: string, outputDir: string) {
    this.handlebars = Handlebars.create();
    this.templatesDir = templatesDir;
    this.outputDir = outputDir;
    this.registerPartials();
    this.registerHelpers();
  }

  get template() {
    if (this._template) {
      return this._template;
    } else {
      let contents = this.readTemplate("contract.mustache");
      this._template = this.handlebars.compile(contents);
      return this._template;
    }
  }

  registerPartials() {
    fs.readdirSync(this.templatesDir).forEach(file => {
      let match = file.match(/^_(\w+)\.(handlebars|mustache)/);
      if (match) {
        this.handlebars.registerPartial(match[1], this.readTemplate(file));
      }
    });
  }

  registerHelpers() {
    this.handlebars.registerHelper("inputType", helpers.inputType);
    this.handlebars.registerHelper("outputType", helpers.outputType);
  }

  render(abiFilePath: string) {
    let artifact = JSON.parse(fs.readFileSync(abiFilePath).toString());
    let abi = artifact.abi as Array<AbiItem> | null;
    if (abi) {
      let methods = abi.filter(isAbiFunction).map(abi => {
        if (abi.outputs && abi.outputs.length === 1) {
          abi.singleReturnValue = true;
        }
        abi.inputs = abi.inputs || [];
        abi.inputs = abi.inputs.map((input, index) => {
          input.name = input.name ? input.name : `param${index}`;
          return input;
        });
        return abi;
      });
      let getters = methods.filter((abi: MethodAbi) => abi.constant);
      let functions = methods.filter((abi: MethodAbi) => !abi.constant);

      let events = abi.filter(isAbiEvent);

      let contractName = path.parse(abiFilePath).name;
      const basename = path.basename(abiFilePath, path.extname(abiFilePath));
      const filePath = `${this.outputDir}/${basename}.ts`;
      const relativeArtifactPath = path.relative(this.outputDir, abiFilePath);

      let context: Context = {
        artifact: JSON.stringify(artifact, null, 2),
        contractName: contractName,
        relativeArtifactPath: relativeArtifactPath,
        getters: getters,
        functions: functions,
        events: events
      };
      let code = this.template(context);
      fs.writeFileSync(filePath, code);
    } else {
      throw new Error(`No ABI found in ${abiFilePath}.`);
    }
  }

  protected readTemplate(name: string) {
    let file = path.resolve(this.templatesDir, name);
    return fs.readFileSync(file).toString();
  }
}
