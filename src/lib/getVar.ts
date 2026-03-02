export const getVar = (property: string, element: HTMLElement): string =>
  getComputedStyle(element).getPropertyValue(property);
