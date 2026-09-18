import { SiteConfig } from "@/types";

// Injects the site's theme colors as CSS variables so they can be used by
// Tailwind arbitrary-value classes like `bg-[var(--accent)]`. Rendered once
// in the public layout. The `--accent-hover` shade is derived automatically.
export default function ThemeStyle({ theme }: { theme: SiteConfig["theme"] }) {
  const css = `:root{
    --accent: ${theme.accentColor};
    --accent-hover: color-mix(in srgb, ${theme.accentColor} 82%, #000);
    --accent-text: ${theme.accentTextColor};
    --background: ${theme.backgroundColor};
  }`;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
