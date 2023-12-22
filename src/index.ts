#!/usr/bin/env node

import { packageDirectory } from "pkg-dir";
import { rootPkgJSON } from "root-pkg-json";
import { detect } from "detect-package-manager";
import { getPackageJsonScripts } from "utilities/getPackageJsonScripts";
import { selectAndRunScript } from "utilities/selectAndRunScript";

export const main = async () => {
  const rootPackageJsonFilePath = await rootPkgJSON();
  const currentPackageJsonFilePath = await packageDirectory().then((route) =>
    route ? route + "/package.json" : undefined
  );

  if (!rootPackageJsonFilePath) {
    console.warn(
      "We could not find root package.json. Check if the current path in the terminal is in an existing javascript project."
    );
    return;
  }

  const rootPackageJson = await getPackageJsonScripts(rootPackageJsonFilePath);

  const currentPackageJson = await getPackageJsonScripts(
    currentPackageJsonFilePath
  );

  const packageManager = await detect({
    cwd: rootPackageJsonFilePath.replace("/package.json", ""),
  });

  if (currentPackageJson?.scripts) {
    const switchToRoot = await selectAndRunScript({
      packageManager,
      scripts: currentPackageJson.scripts,
      includeContextSwitch:
        currentPackageJsonFilePath !== rootPackageJsonFilePath,
      packagePath: currentPackageJsonFilePath!.replace("/package.json", ""),
    });

    if (!switchToRoot) return;
  }

  if (
    currentPackageJsonFilePath !== rootPackageJsonFilePath &&
    !currentPackageJson?.scripts
  ) {
    console.log("\n---------------------------------------");
    console.log(`No scripts found in package.json file.\n`);
    console.log("Path of package.json file: ${currentPackageJsonFilePath}\n");
    console.log("Will show root package scripts:");
    console.log("---------------------------------------\n\n");
  }

  if (!rootPackageJson?.scripts) {
    console.log(
      `No scripts found in package.json file.\n\nPath of package.json file: ${currentPackageJsonFilePath}`
    );
    return;
  }

  if (rootPackageJson?.scripts) {
    await selectAndRunScript({
      packageManager,
      scripts: rootPackageJson?.scripts,
      includeContextSwitch: false,
      packagePath: rootPackageJsonFilePath.replace("/package.json", ""),
    });
  }
};

main();
