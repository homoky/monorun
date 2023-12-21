#!/usr/bin/env node

import { rootPkgJSON } from "root-pkg-json";
import { packageDirectory } from "pkg-dir";
import fs from "fs/promises";
import { spawn } from "child_process";
import prompts from "prompts";
import { detect } from "detect-package-manager";

export const findPackageJson = async () => {
  const rootPackageJson = await rootPkgJSON();
  const packageJson = await packageDirectory().then((route) =>
    route ? route + "/package.json" : undefined
  );

  const rootPackageJsonContent = rootPackageJson
    ? await fs
        .readFile(rootPackageJson, "utf-8")
        .then((content) => JSON.parse(content))
    : undefined;

  const packageJsonContent = packageJson
    ? await fs
        .readFile(packageJson, "utf-8")
        .then((content) => JSON.parse(content))
    : undefined;

  return {
    rootPackageJson,
    packageJson,
    rootPackageJsonContent,
    packageJsonContent,
    isRootPackageJson: rootPackageJson === packageJson,
  };
};

const run = async () => {
  const root = await rootPkgJSON();
  const packageManager = await detect({
    cwd: root?.replace("/package.json", ""),
  });

  const data = await findPackageJson();

  const { scope } = data.isRootPackageJson
    ? { scope: "monorepo" }
    : await prompts({
        type: "select",
        name: "scope",
        message: "Please choose the target for script execution:",
        choices: [
          {
            title: "Current package",
            selected: true,
            value: "closest",
          },
          {
            title: "Project root",
            value: "monorepo",
          },
        ],
      });

  const scripts =
    scope === "closest"
      ? data.packageJsonContent.scripts
      : data.rootPackageJsonContent.scripts;

  const choises = Object.entries(scripts).map(([key, value]) => ({
    title: key as string,
    value: key as string,
    description: `${value}\n`,
  }));

  const { script } = await prompts({
    type: "autocomplete",
    name: "script",
    message: "Select script to run:",
    choices: choises,
  });

  spawn(packageManager, ["run", script], { stdio: "inherit" });
};

run();
