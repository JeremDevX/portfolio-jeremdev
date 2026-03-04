import assert from "node:assert/strict";
import test from "node:test";
import {
  isEscapeKey,
  isPointerOutsideContainer,
  shouldCloseOnBlur,
} from "../../src/components/custom/LanguageSwitcher/languageSwitcher.helpers.ts";

test("isEscapeKey only matches Escape keyboard input", () => {
  assert.equal(isEscapeKey("Escape"), true);
  assert.equal(isEscapeKey("Enter"), false);
  assert.equal(isEscapeKey(" "), false);
});

test("shouldCloseOnBlur closes only when focus leaves the switcher", () => {
  const insideNode = { id: "inside" };
  const outsideNode = { id: "outside" };
  const container = {
    contains: (target) => target === insideNode,
  };

  assert.equal(shouldCloseOnBlur(container, insideNode), false);
  assert.equal(shouldCloseOnBlur(container, outsideNode), true);
  assert.equal(shouldCloseOnBlur(container, null), true);
});

test("isPointerOutsideContainer detects outside click targets", () => {
  const insideNode = { id: "inside" };
  const outsideNode = { id: "outside" };
  const container = {
    contains: (target) => target === insideNode,
  };

  assert.equal(isPointerOutsideContainer(container, insideNode), false);
  assert.equal(isPointerOutsideContainer(container, outsideNode), true);
  assert.equal(isPointerOutsideContainer(container, null), true);
  assert.equal(isPointerOutsideContainer(null, outsideNode), false);
});
