"use client";
import {
  useEffect,
  useSyncExternalStore,
  createContext,
  useContext,
} from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/components/providers/language-provider";
const ThemeContext = createContext(null);
let memoryTheme = "system";
function snapshot() {
  try {
    const value = localStorage.getItem("tjp-admin-theme");
    return ["light", "dark", "system"].includes(value) ? value : memoryTheme;
  } catch {
    return memoryTheme;
  }
}
function subscribe(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener("tjp-theme", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("tjp-theme", callback);
  };
}
export function AdminThemeProvider({ children }) {
  const theme = useSyncExternalStore(subscribe, snapshot, () => "system");
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const update = () =>
      document.documentElement.classList.toggle(
        "dark",
        theme === "dark" || (theme === "system" && media.matches),
      );
    update();
    media.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
      document.documentElement.classList.remove("dark");
    };
  }, [theme]);
  const change = (value) => {
    memoryTheme = value;
    try {
      localStorage.setItem("tjp-admin-theme", value);
    } catch {}
    window.dispatchEvent(new Event("tjp-theme"));
  };
  return (
    <ThemeContext.Provider value={{ theme, change }}>
      {children}
    </ThemeContext.Provider>
  );
}
export function ThemeSelect() {
  const { messages, direction } = useLanguage(),
    t = messages.portal;
  const { theme, change } = useContext(ThemeContext);
  return (
    <DropdownMenu dir={direction}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="plain"
          size="icon"
          className="admin-theme-button"
          aria-label={`${t.theme}: ${t[theme]}`}
          title={`${t.theme}: ${t[theme]}`}
        >
          {theme === "system" ? (
            <Monitor aria-hidden="true" />
          ) : theme === "dark" ? (
            <Moon aria-hidden="true" />
          ) : (
            <Sun aria-hidden="true" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" aria-label={t.theme}>
        <DropdownMenuRadioGroup value={theme} onValueChange={change}>
          {[
            ["light", Sun],
            ["dark", Moon],
            ["system", Monitor],
          ].map(([value, Icon]) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <Icon aria-hidden="true" className="size-4" />
              {t[value]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
