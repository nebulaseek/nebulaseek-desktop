import assert from "node:assert/strict";
import { test } from "node:test";

import {
  communityReleaseAssetNames,
  prepareCommunityReleaseNotes
} from "../prepare-ci-release-notes.mjs";

const productName = "星云寻知";

test("community release notes expose direct links for every public asset", () => {
  const notes = prepareCommunityReleaseNotes({
    template: "# Community\n\n<!-- release-downloads -->\n\nDetails\n",
    repository: "example/desktop",
    tag: "v1.2.3",
    productName,
    assetNames: communityReleaseAssetNames(productName, "1.2.3")
  });

  assert.doesNotMatch(notes, /release-downloads/u);
  assert.match(notes, /## 直接下载 \/ Direct downloads/u);
  for (const name of communityReleaseAssetNames(productName, "1.2.3")) {
    assert.ok(notes.includes(`releases/download/v1.2.3/${encodeURIComponent(name)}`), `missing download link for ${name}`);
  }
});

test("community release asset names follow the configured product name", () => {
  assert.deepEqual(communityReleaseAssetNames("Xingyunxunzhi Desktop", "1.2.3"), [
    "Xingyunxunzhi.Desktop_1.2.3_aarch64.dmg",
    "Xingyunxunzhi.Desktop_1.2.3_x64.dmg",
    "Xingyunxunzhi.Desktop_1.2.3_x64-setup.exe",
    "Xingyunxunzhi.Desktop_1.2.3_amd64.AppImage",
    "Xingyunxunzhi.Desktop_1.2.3_amd64.deb",
    "SHA256SUMS"
  ]);
  assert.throws(() => communityReleaseAssetNames("  ", "1.2.3"), /product name is required/u);
});

test("community release notes reject incomplete or ambiguous inputs", () => {
  assert.throws(() => prepareCommunityReleaseNotes({
    template: "<!-- release-downloads -->",
    repository: "example/desktop",
    tag: "v1.2.3",
    productName,
    assetNames: communityReleaseAssetNames(productName, "1.2.3").slice(1)
  }), /complete public asset set/u);
  assert.throws(() => prepareCommunityReleaseNotes({
    template: "missing marker",
    repository: "example/desktop",
    tag: "v1.2.3",
    productName,
    assetNames: communityReleaseAssetNames(productName, "1.2.3")
  }), /one download marker/u);
  assert.throws(() => prepareCommunityReleaseNotes({
    template: "<!-- release-downloads -->",
    repository: "example/desktop",
    tag: "v1.2.3",
    productName,
    assetNames: communityReleaseAssetNames("Other", "1.2.3")
  }), /complete public asset set/u);
});
