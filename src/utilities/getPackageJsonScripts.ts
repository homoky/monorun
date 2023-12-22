import fs from "fs/promises";
import { PackageJson } from "../types";

export const getPackageJsonScripts = async (path: string | undefined) => {
  const content: PackageJson | undefined = path
    ? await fs
        .readFile(path, "utf-8")
        .then((content: any) => JSON.parse(content))
    : undefined;

  if (!content) return;

  if (
    !content.scripts ||
    Object.keys(content.scripts).length === 0 ||
    !content.name
  ) {
    return;
  }

  return content;
};
