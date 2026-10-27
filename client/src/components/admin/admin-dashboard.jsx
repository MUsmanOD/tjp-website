"use client";

import Image from "next/image";
import { Activity, LayoutDashboard, FileText, Users, WifiOff } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Card } from "@/components/ui/card";
import { media } from "@/config/media";

export function AdminDashboard() {
  const { messages } = useLanguage();
  const copy = messages.admin;
  const summaries = [
    { label: copy.members, icon: Users },
    { label: copy.content, icon: FileText },
    { label: copy.status, icon: WifiOff, value: copy.notConnected },
  ];

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand"><Image src={media.logo.src} alt="" width={48} height={48} /><div><strong>{messages.brand.short}</strong><span>{copy.workspace}</span></div></div>
        <div className="admin-sidebar-current"><LayoutDashboard aria-hidden="true" /><span>{copy.overview}</span></div>
      </aside>
      <div className="admin-dashboard-main">
        <header className="admin-dashboard-header"><span>{copy.workspace}</span><LanguageSwitcher /></header>
        <div className="admin-dashboard-content">
          <div className="admin-dashboard-title"><p className="text-eyebrow">{copy.overview}</p><h1 className="heading-section">{copy.dashboard}</h1><p className="text-body text-muted-foreground">{copy.dashboardDescription}</p></div>
          <div className="admin-summary-grid">
            {summaries.map(({ label, icon: Icon, value }) => <Card className="admin-summary" key={label}><div className="admin-summary-top"><span>{label}</span><Icon aria-hidden="true" /></div><strong>{value || "—"}</strong><p className="text-small text-muted-foreground">{value ? copy.statusDescription : copy.noData}</p></Card>)}
          </div>
          <div className="admin-dashboard-grid">
            <Card className="admin-activity"><div className="admin-panel-heading"><h2 className="heading-card">{copy.activity}</h2><Activity aria-hidden="true" /></div><div className="admin-empty"><Activity aria-hidden="true" /><p className="text-small text-muted-foreground">{copy.noActivity}</p></div></Card>
            <Card className="admin-connection"><div className="admin-panel-heading"><h2 className="heading-card">{copy.status}</h2><WifiOff aria-hidden="true" /></div><span className="admin-status-pill"><span aria-hidden="true" />{copy.notConnected}</span><p className="text-small text-muted-foreground">{copy.statusDescription}</p></Card>
          </div>
        </div>
      </div>
    </div>
  );
}
