"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export function SessionRecords({ sessions, identity, locale, t, params, navigate, setAction }) {
  const scope = params.get("sessionScope") || "all";
  const rows = sessions.filter((item) => scope === "all" || (scope === "current") === (item._id === identity.sessionId));
  const pages = Math.max(1, Math.ceil(rows.length / 8));
  const page = Math.min(pages, Math.max(1, Number(params.get("page")) || 1));
  const visible = rows.slice((page - 1) * 8, page * 8);
  return <section className="admin-records-section">
    <Card className="admin-table-card">
      <div className="admin-table-heading"><h2>{t.sessions}</h2><span className="admin-period">{new Intl.NumberFormat(locale).format(rows.length)}</span></div>
      <Table>
        <TableHeader><TableRow><TableHead>{t.session}</TableHead><TableHead>{t.dashboardUi.sessionStarted}</TableHead><TableHead>{t.status}</TableHead><TableHead>{t.revoke}</TableHead></TableRow></TableHeader>
        <TableBody>{visible.map((item) => <TableRow key={item._id}>
          <TableCell data-label={t.session}>{item._id.slice(-8)}</TableCell>
          <TableCell data-label={t.dashboardUi.sessionStarted}>{new Date(item.createdAt).toLocaleString(locale)}</TableCell>
          <TableCell data-label={t.status}>{item._id === identity.sessionId ? t.currentSession : t.session}</TableCell>
          <TableCell data-label={t.revoke}><Button variant="outline" onClick={() => setAction(item._id)}>{t.revoke}</Button></TableCell>
        </TableRow>)}</TableBody>
      </Table>
      {rows.length === 0 && <p className="admin-table-empty">{t.empty}</p>}
    </Card>
    <nav className="admin-records-pagination" aria-label={t.sessions}>
      <Button variant="outline" disabled={page <= 1} aria-label={t.previous} onClick={() => navigate({ page: String(page - 1) })}><ChevronLeft className="size-4 rtl:rotate-180" aria-hidden="true" /><span className="pagination-label">{t.previous}</span></Button>
      <span>{new Intl.NumberFormat(locale).format(page)} / {new Intl.NumberFormat(locale).format(pages)}</span>
      <Button variant="outline" disabled={page >= pages} aria-label={t.next} onClick={() => navigate({ page: String(page + 1) })}><span className="pagination-label">{t.next}</span><ChevronRight className="size-4 rtl:rotate-180" aria-hidden="true" /></Button>
    </nav>
  </section>;
}
