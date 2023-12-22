import prompts from "prompts";
import { PM } from "detect-package-manager";
import { spawn } from "child_process";

export const selectAndRunScript = async ({
  packageManager,
  scripts,
  includeContextSwitch,
  packagePath,
}: {
  scripts: { [key: string]: string };
  packageManager: PM;
  packagePath: string;
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

  spawn(packageManager, ["run", script], {
    stdio: "inherit",
    cwd: packagePath,
  });

  return;
};
