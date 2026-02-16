// Validate and normalize CSS color strings
export function isValidColor(color: string): boolean {
  if (!color || color.trim() === '') return false;
  
  // Check for hex colors
  if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) return true;
  
  // Check for rgb/rgba
  if (/^rgba?\((\d+),\s*(\d+),\s*(\d+)(,\s*[\d.]+)?\)$/i.test(color)) return true;
  
  // Check for hsl/hsla
  if (/^hsla?\((\d+),\s*([\d.]+)%,\s*([\d.]+)%(,\s*[\d.]+)?\)$/i.test(color)) return true;
  
  // Check for named colors (basic set)
  const namedColors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white', 'gray', 'grey'];
  if (namedColors.includes(color.toLowerCase())) return true;
  
  return false;
}

// Get a safe color value or fallback
export function getSafeColor(color: string, fallback: string): string {
  return isValidColor(color) ? color : fallback;
}

// Apply color to style with validation
export function applyColorStyle(color: string, fallbackClass: string): { style?: React.CSSProperties; className?: string } {
  if (isValidColor(color)) {
    return { style: { color } };
  }
  return { className: fallbackClass };
}
