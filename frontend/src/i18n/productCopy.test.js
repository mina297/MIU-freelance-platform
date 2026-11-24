import test from "node:test";
import assert from "node:assert/strict";
import { productCopy } from "./productCopy.js";
import { translate } from "./translate.js";

test("editorial UI copy has complete English/Arabic text without development labels", () => {
  for (const [key, translations] of Object.entries(productCopy)) {
    assert.equal(translations.length, 2, key);
    for (const language of ["en", "ar"]) {
      const message = translate(language, key);
      assert.ok(message.trim(), key);
      assert.doesNotMatch(
        message,
        /\b(?:phase\s*1|prototype|demo|mock|coming soon|under construction|beta|placeholder|simulat\w*|fictional)\b/i,
        key,
      );
      for (const placeholder of key.match(/\{\w+\}/g) ?? []) {
        assert.ok(message.includes(placeholder), `${language}: ${key}`);
      }
    }
  }
});

test("copy preserves interpolation, user text and truthful account/payment boundaries", () => {
  assert.equal(
    translate("en", "Placeholder for {name}", { name: "Amina" }),
    "Profile image for Amina",
  );
  const userText = "My prototype for the robotics club earned great feedback.";
  assert.equal(translate("en", userText), userText);
  assert.equal(translate("ar", userText), userText);
  assert.match(
    translate(
      "en",
      "Demo checkout · fictional payment methods, no real charges or escrow custody.",
    ),
    /No charge is made/,
  );
  assert.match(
    translate("en", "Prototype recovery. No email or reset link is sent."),
    /No reset link will be sent/,
  );
  assert.match(
    translate("ar", "Demo replies · Not a real AI service"),
    /أدلة المنصة/,
  );
});
