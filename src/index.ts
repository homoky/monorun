#!/usr/bin/env node

import { packageDirectory } from "pkg-dir";
import { rootPkgJSON } from "root-pkg-json";
import fs from "fs/promises";
import { PackageJson } from "./types";
import { spawn } from "child_process";
import prompts from "prompts";
import { detect, PM } from "detect-package-manager";

export const getPackageJsonScripts = async (path: string | undefined) => {
  const content: PackageJson | undefined = path
    ? await fs
        .readFile(path, "utf-8")
        .then((content: any) => JSON.parse(content))
    : undefined;

  if (!content) return;

  if (!content.scripts || Object.keys(content.scripts).length === 0) {
    return;
  }

  return content.scripts;
};

const selectAndRunScript = async ({
  packageManager,
  scripts,
  includeContextSwitch,
}: {
  scripts: { [key: string]: string };
  packageManager: PM;
  includeContextSwitch: boolean;
}) => {
  if (!scripts || Object.keys(scripts).length === 0) {
    console.log("No scripts found in package.json file.");
    return;
  }

  const choises = Object.entries(scripts).map(([key, value]) => ({
    title: key as string,
    value: key as string,
    description: `${value}\n`,
  }));

  if (includeContextSwitch) {
    choises.unshift({
      title: "Project root",
      description:
        "Change scope from package level to project level to pick script from project root package.json\n",
      value: "_root",
    });
  }

  const { script } = await prompts({
    type: "autocomplete",
    name: "script",
    message: "Select script to run:",
    choices: choises,
    active: "none",
  });

  if (!script) {
    console.log("\nExited gracefully.\n");
    process.exit(0);
  }

  if (script === "_root") {
    return true;
  }

  spawn(packageManager, ["run", script], { stdio: "inherit" });

  return false;
};

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

  const rootPackageJsonScripts = await getPackageJsonScripts(
    rootPackageJsonFilePath
  );

  const currentPackageJsonScripts = await getPackageJsonScripts(
    currentPackageJsonFilePath
  );

  const packageManager = await detect({
    cwd: rootPackageJsonFilePath.replace("/package.json", ""),
  });

  if (currentPackageJsonScripts) {
    const switchToRoot = await selectAndRunScript({
      packageManager,
      scripts: currentPackageJsonScripts,
      includeContextSwitch:
        currentPackageJsonFilePath !== rootPackageJsonFilePath,
    });

    if (!switchToRoot) return;
  }

  if (
    currentPackageJsonFilePath !== rootPackageJsonFilePath &&
    !currentPackageJsonScripts
  ) {
    console.log("\n---------------------------------------");
    console.log(`No scripts found in package.json file.\n`);
    console.log("Path of package.json file: ${currentPackageJsonFilePath}\n");
    console.log("Will show root package scripts:");
    console.log("---------------------------------------\n\n");
  }

  if (!rootPackageJsonScripts) {
    console.log(
      `No scripts found in package.json file.\n\nPath of package.json file: ${currentPackageJsonFilePath}`
    );
    return;
  }

  if (rootPackageJsonScripts) {
    await selectAndRunScript({
      packageManager,
      scripts: rootPackageJsonScripts,
      includeContextSwitch: false,
    });
  }
};

main();
