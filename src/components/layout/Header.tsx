import { Moon, Sun, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";

const routeTitles: Record<string, string> = {
  "/": "لوحة التحكم",
  "/shipments": "الشحنات",
  "/products": "المنتجات",
  "/warehouses": "المخازن",
  "/employees": "الموظفين",
  "/importers": "المستوردين",
  "/payments": "المدفوعات",
  "/transportation": "وسائل النقل",
  "/containers": "الحاويات",
};

export function Header() {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const pageTitle = routeTitles[location.pathname] ?? "نظام الاستيراد والتصدير";
  const today = useMemo(
    () => new Date().toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    []
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-xl px-6">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>الصفحة الحالية: {pageTitle}</span>
        </div>
        <span className="text-xs text-muted-foreground/80">{today}</span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="text-muted-foreground hover:text-foreground"
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </header>
  );
}
