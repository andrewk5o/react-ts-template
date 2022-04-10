import path from "path";
import fs from "fs";
import chalk from "chalk";

export default class VersionUpdater {
  constructor(type) {
    this.type = type;
  }

  apply(compiler) {
    compiler.hooks.done.tap(VersionUpdater.name, () => {
      if (compiler.options.mode !== "production") return;
      const filePath = path.resolve(process.cwd(), "package.json");
      const rawData = fs.readFileSync(filePath);
      const packageJson = JSON.parse(rawData);
      const prevVersion = packageJson.version;

      let [major, minor, patch] = prevVersion.split(".");
      switch(this.type) {
        case "major":
          major++;
          minor = 0;
          patch = 0;
          break;
        case "minor":
          minor++;
          patch = 0;
          break;
        case "patch":
        case undefined:
          patch++;
          break;
      }

      packageJson.version = [major, minor, patch].join(".");
      const data = JSON.stringify(packageJson, null, 2);
      fs.writeFileSync(filePath, data);
      console.log(`\n\nPackage version successfully updated: ${chalk.red(prevVersion)} --> ${chalk.green(packageJson.version)}\n`)
    })
  }
}