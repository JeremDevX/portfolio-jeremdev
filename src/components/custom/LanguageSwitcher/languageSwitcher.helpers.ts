type ContainsNode = Pick<Node, "contains">;

export function isEscapeKey(key: string): boolean {
  return key === "Escape";
}

export function shouldCloseOnBlur(
  currentTarget: ContainsNode,
  relatedTarget: Node | null
): boolean {
  return !currentTarget.contains(relatedTarget);
}

export function isPointerOutsideContainer(
  container: ContainsNode | null,
  target: EventTarget | null
): boolean {
  if (!container) {
    return false;
  }

  return !container.contains(target as Node | null);
}
