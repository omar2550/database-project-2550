import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Ship,
  Package,
  Warehouse,
  Users,
  Building2,
  CreditCard,
  Truck,
  Container,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "لوحة التحكم", href: "/" },
  { icon: Ship, label: "الشحنات", href: "/shipments" },
  { icon: Package, label: "المنتجات", href: "/products" },
  { icon: Warehouse, label: "المخازن", href: "/warehouses" },
  { icon: Users, label: "الموظفين", href: "/employees" },
  { icon: Building2, label: "المستوردين", href: "/importers" },
  { icon: CreditCard, label: "المدفوعات", href: "/payments" },
  { icon: Truck, label: "النقل", href: "/transportation" },
  { icon: Container, label: "الحاويات", href: "/containers" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed right-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300",
        collapsed ? "w-0 md:w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="relative flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                <Ship className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-cairo text-lg font-bold text-sidebar-foreground">
                شركة الاستيراد والتصدير
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              "text-sidebar-foreground bg-sidebar-accent",
              collapsed
                ? "absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:static md:translate-x-0 md:top-auto md:-translate-y-0"
                : ""
            )}
          >
            {collapsed ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation */}
        {collapsed ? (
          <nav className="hidden md:block md:space-y-1 md:p-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center justify-center rounded-lg py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </Link>
              );
            })}
          </nav>
        ) : (
          <nav className="flex-1 space-y-1 p-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-cairo">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </aside>
  );
}
