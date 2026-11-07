"use client";

import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export function SecurityRecords({ identity, locale, t, params }) {
  const filter = params.get("mfa") || "all";
  const visible = filter === "all" || (filter === "enabled") === !!identity.mfaEnabled;
  return <Card className="admin-table-card admin-records-section">
    <div className="admin-table-heading"><h2>{t.security}</h2><span className="admin-period">{visible ? 1 : 0}</span></div>
    <Table>
      <TableHeader><TableRow><TableHead>{t.currentSession}</TableHead><TableHead>{t.twoFactor}</TableHead><TableHead>{t.dashboardUi.sessionExpires}</TableHead></TableRow></TableHeader>
      <TableBody>{visible && <TableRow>
        <TableCell data-label={t.currentSession}>{identity.sessionId?.slice(-8) || "—"}</TableCell>
        <TableCell data-label={t.twoFactor}>{identity.mfaEnabled ? t.twoFactorOn : t.twoFactorOff}</TableCell>
        <TableCell data-label={t.dashboardUi.sessionExpires}>{identity.expiresAt ? new Date(identity.expiresAt).toLocaleString(locale) : "—"}</TableCell>
      </TableRow>}</TableBody>
    </Table>
    {!visible && <p className="admin-table-empty">{t.empty}</p>}
  </Card>;
}
