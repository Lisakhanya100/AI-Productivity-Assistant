import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  ListChecks,
  Sparkles,
  MessageSquare,
  Bot,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const tools = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Meeting Notes", url: "/meeting-notes", icon: FileText },
  { title: "Task Planner", url: "/task-planner", icon: ListChecks },
  { title: "Research Assistant", url: "/research", icon: Sparkles },
  { title: "AI Chatbot", url: "/chatbot", icon: MessageSquare },
];

export function AppSidebar() {
  const currentPath = useRouterState({
    select: (s) => s.location.pathname,
  });
  const isActive = (url: string) =>
    url === "/" ? currentPath === "/" : currentPath.startsWith(url);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg gradient-primary shadow-elegant">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-display text-sm font-semibold tracking-tight">
              Workspace AI
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Productivity Suite
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="rounded-md border bg-card/60 p-3 text-[11px] leading-snug text-muted-foreground group-data-[collapsible=icon]:hidden">
          <p className="font-medium text-foreground">Responsible AI</p>
          <p className="mt-1">
            Outputs are AI-generated and may be inaccurate. Always review
            before sharing.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
