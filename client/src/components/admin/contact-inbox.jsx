"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/components/providers/language-provider";
import { DashboardLoading } from "@/components/providers/website-loading";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/portal-api";
import { contactTopics } from "@/lib/website-content";

export function ContactInbox({ sessionId }) {
  const { messages, locale, direction } = useLanguage();
  const copy = messages.websiteAdmin;
  const t = messages.portal;
  const cache = useQueryClient();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const prefix = ["admin", "inbox", sessionId];
  const listing = useQuery({
    queryKey: [...prefix, page],
    queryFn: () => api("/admin/website/messages?page=" + page),
    retry: false, gcTime: 0,
  });
  const detailKey = [...prefix, "message", selected];
  const detail = useQuery({
    queryKey: detailKey,
    queryFn: () => api("/admin/website/messages/" + selected),
    enabled: !!selected, retry: false, gcTime: 0,
  });
  const markRead = useMutation({
    mutationFn: (id) => api(`/admin/website/messages/${id}/read`, { method: "PATCH" }),
    onSuccess: () => cache.invalidateQueries({ queryKey: prefix }),
  });
  const topic = (key) => messages.contact.topics[contactTopics.indexOf(key)] || messages.form.topic;
  const date = (value) => new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  const status = (error) => t.errors[error?.message] || t.errors.INTERNAL;
  const result = listing.data;
  const message = detail.data;

  return <>
    <DashboardLoading busy={listing.isFetching && !result} />
    <div className="admin-editor-list space-y-3">
      <div className="flex justify-end">
        <Button type="button" size="sm" variant="outline" disabled={listing.isFetching} onClick={() => listing.refetch()}>{copy.refresh}</Button>
      </div>
      {listing.error && <p role="alert" className="text-sm text-destructive">{status(listing.error)}</p>}
      <Card className="admin-table-card">
        <Table>
          <TableHeader><TableRow><TableHead>{messages.form.topic}</TableHead><TableHead>{copy.received}</TableHead><TableHead>{copy.status}</TableHead><TableHead>{copy.actions}</TableHead></TableRow></TableHeader>
          <TableBody>{result?.rows.map((row) => <TableRow key={row._id}>
            <TableCell data-label={messages.form.topic} className="font-semibold">{topic(row.topic)}</TableCell>
            <TableCell data-label={copy.received}>{date(row.createdAt)}</TableCell>
            <TableCell data-label={copy.status}>{row.readAt ? copy.read : copy.unread}</TableCell>
            <TableCell data-label={copy.actions}>
              <Button type="button" size="sm" variant="outline" onClick={() => { markRead.reset(); setSelected(row._id); }}>{copy.openMessage}</Button>
            </TableCell>
          </TableRow>)}</TableBody>
        </Table>
        {result?.rows.length === 0 && <p className="admin-table-empty">{copy.emptyInbox}</p>}
      </Card>
      <nav className="admin-records-pagination" aria-label={copy.inbox}>
        <Button type="button" variant="outline" disabled={!result || result.page <= 1} aria-label={t.previous} onClick={() => setPage(result.page - 1)}><ChevronLeft className="rtl:rotate-180" aria-hidden="true" /></Button>
        <span>{result?.page ?? page} / {result?.pages ?? 1}</span>
        <Button type="button" variant="outline" disabled={!result || result.page >= result.pages} aria-label={t.next} onClick={() => setPage(result.page + 1)}><ChevronRight className="rtl:rotate-180" aria-hidden="true" /></Button>
      </nav>
    </div>
    <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
      {selected && <DialogContent aria-describedby={undefined} closeLabel={messages.common.close} dir={direction} className="admin-editor-dialog">
        <DialogTitle className="heading-card">{message ? topic(message.topic) : copy.inbox}</DialogTitle>
        {detail.isPending && <p role="status">{t.loading}</p>}
        {detail.error && <p role="alert">{status(detail.error)}</p>}
        {message && <div className="space-y-3">
          <div className="text-sm">
            <p className="font-semibold break-words">{message.name}</p>
            <a className="text-link block break-all" href={`mailto:${message.email}`} dir="ltr">{message.email}</a>
            <p className="text-xs text-muted-foreground">{date(message.createdAt)}</p>
          </div>
          <p className="whitespace-pre-wrap rounded-md bg-muted p-3 text-sm [overflow-wrap:anywhere]">{message.message}</p>
          {!message.readAt && <Button type="button" variant="outline" disabled={markRead.isPending} onClick={() => markRead.mutate(message._id)}>{copy.markRead}</Button>}
          {markRead.error && <p role="alert">{status(markRead.error)}</p>}
        </div>}
      </DialogContent>}
    </Dialog>
  </>;
}
