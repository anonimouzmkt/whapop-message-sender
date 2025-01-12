import { Send } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <img
              src="https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2Fc34a4d04c3399b3a0ee4e48ab25ef55c.cdn.bubble.io%2Ff1732409705581x641240799581334800%2F1b560689-fc0e-48a1-8deb-4474283b9c76.jpg?w=64&h=64&auto=compress&dpr=1.5&fit=max"
              alt="Logo"
              className="w-8 h-8 rounded-full mb-4"
            />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/">
                    <Send className="w-4 h-4" />
                    <span>Disparo A.I</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}