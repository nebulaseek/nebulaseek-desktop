import test from "node:test";
import assert from "node:assert/strict";
import { macDmgFilename } from "../macos-dmg.mjs";

test("builds deterministic macOS DMG names", () => {
  assert.equal(
    macDmgFilename("Xingyunxunzhi", "1.0.0", "aarch64"),
    "Xingyunxunzhi_1.0.0_aarch64.dmg"
  );
  assert.equal(
    macDmgFilename("Xingyunxunzhi", "1.0.0", "x64"),
    "Xingyunxunzhi_1.0.0_x64.dmg"
  );
});

test("rejects unsupported macOS DMG architectures", () => {
  assert.throws(
    () => macDmgFilename("Xingyunxunzhi", "1.0.0", "universal"),
    /unsupported macOS DMG architecture/u
  );
});
