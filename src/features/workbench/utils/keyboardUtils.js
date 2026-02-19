export function moveSidebarFocus(currentElement, direction) {
  const sidebar = currentElement.closest('.sidebar');
  if (!sidebar) return;

  const focusableItems = Array.from(sidebar.querySelectorAll('.tree-item'));
  const currentIndex = focusableItems.indexOf(currentElement);
  if (currentIndex < 0) return;

  const nextIndex = currentIndex + direction;
  if (nextIndex < 0 || nextIndex >= focusableItems.length) return;

  focusableItems[nextIndex].focus();
}
