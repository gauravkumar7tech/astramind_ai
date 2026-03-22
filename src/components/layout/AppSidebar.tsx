import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navigationItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Chat Analyst", url: "/chat", icon: MessageSquare },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Predictions", url: "/predictions", icon: TrendingUp },
  { title: "Recommendations", url: "/recommendations", icon: Lightbulb },
  { title: "Alerts", url: "/alerts", icon: AlertTriangle },
  { title: "Data Manager", url: "/data", icon: Database },
];

const bottomItems = [
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const NavItem = ({ item }: { item: typeof navigationItems[0] }) => {
    const active = isActive(item.url);
    
    const linkContent = (
      <NavLink
        to={item.url}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
          "hover:bg-sidebar-accent group",
          active && "bg-sidebar-accent text-primary"
        )}
        activeClassName="bg-sidebar-accent text-primary"
      >
        <item.icon
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            active ? "text-primary" : "text-sidebar-foreground group-hover:text-foreground"
          )}
        />
        {!collapsed && (
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              active ? "text-foreground" : "text-sidebar-foreground group-hover:text-foreground"
            )}
          >
            {item.title}
          </span>
        )}
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right" className="bg-popover border-border">
            {item.title}
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkContent;
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold text-gradient">AstraMind</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => (
          <NavItem key={item.url} item={item} />
        ))}
      </nav>

      {/* Bottom items */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        {bottomItems.map((item) => (
          <NavItem key={item.url} item={item} />
        ))}
      </div>
    </aside>
  );
}
