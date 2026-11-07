"use client";

import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export function MemberRecords({ listing, t, locale, placeName, open, navigate }) {
  const rows = listing?.rows || [];
  const page = Math.max(1, listing?.page || 1);
  const pages = Math.max(1, listing?.pages || 1);
  return <section className="admin-records-section">
    <Card className="admin-table-card">
      <div className="admin-table-heading">
        <h2>{t.dashboardUi.memberRecords}</h2>
        <span className="admin-period">{new Intl.NumberFormat(locale).format(listing?.total ?? rows.length)}</span>
      </div>
      <Table>
        <TableHeader><TableRow>{["name", "ageGroup", "region", "status", "createdAt"].map((key) => <TableHead key={key}>{t[key]}</TableHead>)}</TableRow></TableHeader>
        <TableBody>{rows.map((row) => <TableRow key={row.id}>
          <TableCell data-label={t.name}><button className="text-link" onClick={() => open(row.id)}>{row.name}</button></TableCell>
          <TableCell data-label={t.ageGroup}>{t[row.ageGroup] || t.unspecified}</TableCell>
          <TableCell data-label={t.region}>{placeName(row.region)}</TableCell>
          <TableCell data-label={t.status}><Badge className={"admin-status admin-status-" + row.status}>{t[row.status]}</Badge></TableCell>
          <TableCell data-label={t.createdAt}>{new Date(row.createdAt).toLocaleDateString(locale)}</TableCell>
        </TableRow>)}</TableBody>
      </Table>
      {rows.length === 0 && <div className="admin-table-empty">
        <span><Inbox aria-hidden="true" /></span>
        <strong>{t.dashboardUi.noMembers}</strong>
        <p>{t.dashboardUi.noMembersDescription}</p>
      </div>}
    </Card>
    <nav className="admin-records-pagination" aria-label={t.dashboardUi.memberRecords}>
      <Button variant="outline" disabled={page <= 1} onClick={() => navigate({ page: String(page - 1) })} aria-label={t.previous}>
        <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden="true" /><span className="pagination-label">{t.previous}</span>
      </Button>
      <span>{new Intl.NumberFormat(locale).format(page)} / {new Intl.NumberFormat(locale).format(pages)}</span>
      <Button variant="outline" disabled={page >= pages} onClick={() => navigate({ page: String(page + 1) })} aria-label={t.next}>
        <span className="pagination-label">{t.next}</span><ChevronRight className="size-4 rtl:rotate-180" aria-hidden="true" />
      </Button>
    </nav>
  </section>;
}
