import { History, Package, TrendingUp } from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Transaksi",
    url: "/",
    icon: TrendingUp,
    description: "Kelola transaksi barang",
  },
  {
    title: "Stok Barang",
    url: "/stock",
    icon: Package,
    description: "Kelola stok barang",
  },
  {
    title: "Riwayat",
    url: "/history",
    icon: History,
    description: "Lihat riwayat transaksi",
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Package className="h-6 w-6" />
          <div className="flex flex-col">
            <span className="font-semibold text-lg">Inventory</span>
            <span className="text-xs text-muted-foreground">
              Management System
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
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
    </Sidebar>
  );
}
