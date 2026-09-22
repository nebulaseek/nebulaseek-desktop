import { readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import process from "node:process";

import { DEFAULT_CONFIG } from "./lib/build-config.mjs";
import { desktopArtifactName } from "./lib/desktop-artifacts.mjs";
import { parseReleaseTag } from "./lib/release-tag.mjs";
import { publicArtifactProductName } from "./prepare-ci-release-assets.mjs";

const root = resolve(import.meta.dirname, "..");
const DOWNLOADS_MARKER = "<!-- release-downloads -->";
const CHANGES_MARKER = "<!-- release-changes -->";

function downloadUrl(repository, tag, name) {
  return `https://github.com/${repository}/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(name)}`;
}

export function communityReleaseAssetNames(version, productName = DEFAULT_CONFIG.DESKTOP_APP_NAME) {
  const publicProductName = publicArtifactProductName(productName);
  return [
    desktopArtifactName({ productName: publicProductName, version, target: "aarch64-apple-darwin", extension: ".dmg" }),
    desktopArtifactName({ productName: publicProductName, version, target: "x86_64-apple-darwin", extension: ".dmg" }),
    desktopArtifactName({ productName: publicProductName, version, target: "x86_64-pc-windows-msvc", extension: ".exe" }),
    desktopArtifactName({ productName: publicProductName, version, target: "x86_64-unknown-linux-gnu", extension: ".AppImage" }),
    desktopArtifactName({ productName: publicProductName, version, target: "x86_64-unknown-linux-gnu", extension: ".deb" }),
    "SHA256SUMS"
  ];
}

export function unreleasedChanges(changelog) {
  const match = /(?:^|\n)## 未发布[^\S\r\n]*\r?\n([\s\S]*?)(?=\r?\n##[^\S\r\n]|$)/u.exec(changelog);
  const changes = match?.[1]?.trim();
  if (!changes || !changes.split("\n").some(line => /^-\s+/u.test(line))) {
    throw new Error("CHANGELOG must contain non-empty unreleased changes");
  }
  return changes;
}

export function prepareCommunityReleaseNotes({ template, repository, tag, assetNames, changes }) {
  if (!/^[^/\s]+\/[^/\s]+$/u.test(repository || "")) throw new Error("GitHub repository must use owner/name format");
  const { version } = parseReleaseTag(tag);
  const expected = communityReleaseAssetNames(version);
  const actual = [...assetNames].sort();
  if (JSON.stringify(actual) !== JSON.stringify([...expected].sort())) {
    throw new Error("release notes require the complete public asset set");
  }
  if (template.split(DOWNLOADS_MARKER).length !== 2) {
    throw new Error("community release notes must contain one download marker");
  }
  if (template.split(CHANGES_MARKER).length !== 2) {
    throw new Error("community release notes must contain one changes marker");
  }
  if (typeof changes !== "string" || changes.trim().length === 0) {
    throw new Error("community release notes require release changes");
  }

  const links = [
    ["macOS Apple 芯片 / Apple Silicon", expected[0]],
    ["macOS Intel", expected[1]],
    ["Windows x64", expected[2]],
    ["Linux x64 AppImage", expected[3]],
    ["Linux x64 DEB", expected[4]],
    ["SHA-256 校验文件 / checksums", expected[5]]
  ].map(([label, name]) => `- [${label}](${downloadUrl(repository, tag, name)})`).join("\n");

  const downloads = `## 直接下载 / Direct downloads\n\n${links}`;
  const releaseChanges = `## 主要变化\n\n${changes.trim()}`;
  return template.replace(DOWNLOADS_MARKER, downloads).replace(CHANGES_MARKER, releaseChanges);
}

export async function prepareCommunityReleaseNotesFile({ templatePath, changelogPath, assetsPath, outputPath, repository, tag }) {
  const entries = await readdir(assetsPath, { withFileTypes: true });
  if (entries.some(entry => !entry.isFile())) throw new Error("public release assets must only contain files");
  const notes = prepareCommunityReleaseNotes({
    template: await readFile(templatePath, "utf8"),
    repository,
    tag,
    assetNames: entries.map(entry => entry.name),
    changes: unreleasedChanges(await readFile(changelogPath, "utf8"))
  });
  await writeFile(outputPath, notes);
  return outputPath;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  const output = await prepareCommunityReleaseNotesFile({
    templatePath: process.env.CI_RELEASE_NOTES_TEMPLATE || join(root, ".github", "release-notes-community.md"),
    changelogPath: process.env.CI_RELEASE_CHANGELOG || join(root, "CHANGELOG.md"),
    assetsPath: process.env.CI_RELEASE_ASSETS_OUTPUT || join(root, "release-assets", "publish"),
    outputPath: process.env.CI_RELEASE_NOTES_OUTPUT || join(root, "release-assets", "RELEASE-NOTES.md"),
    repository: process.env.GITHUB_REPOSITORY,
    tag: process.env.GITHUB_REF_NAME
  });
  console.log(`prepared release notes at ${basename(output)}`);
}
