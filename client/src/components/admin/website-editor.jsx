"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/components/providers/language-provider";
import { DashboardLoading } from "@/components/providers/website-loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input, NativeSelect, Textarea } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { api } from "@/lib/portal-api";
import { galleryCategories, localized, uploadedImage, websiteKey } from "@/lib/website-content";

export const websiteViews = ["pages", "branding", "menu", "contact", "leaders", "gallery", "inbox", "settings"];
const socialPlatforms = ["facebook", "x", "instagram", "youtube"];

function Field({ label, children }) {
  return <label className="min-w-0 space-y-1">
    <span className="block text-sm font-semibold">{label}</span>
    {children}
  </label>;
}

function LanguageFields({ label, field, value, max, required, multiline, copy }) {
  const Control = multiline ? Textarea : Input;
  return <div className="admin-editor-grid">
    {["en", "ur"].map((locale) => <Field key={locale} label={`${label} (${copy[locale]})`}>
      <Control name={`${field}.${locale}`} defaultValue={value?.[locale] || ""}
        required={required && locale === "en"} maxLength={max} lang={locale}
        dir={locale === "ur" ? "rtl" : "ltr"} className={multiline ? "min-h-20" : undefined} />
    </Field>)}
  </div>;
}

function Photo({ src }) {
  if (!src) return null;
  return <span className="relative block size-14 shrink-0 overflow-hidden rounded-md bg-surface">
    <Image src={src} alt="" fill sizes="56px" unoptimized={uploadedImage(src) || src.endsWith(".ico")} className="object-contain" />
  </span>;
}

async function encodePhoto(file) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 12 * 1024 * 1024) {
    throw new Error("INVALID_IMAGE");
  }
  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
    const ratio = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
    canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL("image/webp", 0.85);
    const prefix = "data:image/webp;base64,";
    if (!url.startsWith(prefix) || url.length - prefix.length > 2796204) throw new Error();
    return url.slice(prefix.length);
  } catch {
    throw new Error("INVALID_IMAGE");
  } finally {
    bitmap?.close();
  }
}

function EditorForm({ mode, entry, save, page }) {
  const { messages, locale } = useLanguage();
  const copy = messages.websiteAdmin;
  const t = messages.portal;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const id = useRef(entry.id);
  const settings = mode === "branding";
  const contact = mode === "contact";
  const leader = mode === "leaders";
  const menu = mode === "menu";
  const favicon = mode === "favicon";
  const pageEditor = mode === "pages";
  const contentEntry = leader || mode === "gallery";

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const value = (key) => String(formData.get(key) ?? "").trim();
    const pair = (key) => ({ en: value(key + ".en"), ur: value(key + ".ur") });
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      const file = formData.get("image");
      const image = file?.size ? await encodePhoto(file) : undefined;
      let body;
      if (settings) {
        body = {
          name: pair("name"),
          social: Object.fromEntries(socialPlatforms.map((platform) => [platform, value(platform)])),
          image,
          resetLogo: !image && formData.has("resetLogo"),
        };
      } else if (contact) {
        body = { name: pair("name"), address: pair("address"), phone: value("phone"), email: value("email") };
      } else if (favicon) {
        body = { image, reset: !image && formData.has("resetLogo") };
      } else if (pageEditor) {
        body = Object.fromEntries(entry.map(({ path }) => [path, pair(path)]));
      } else if (menu) {
        id.current ??= crypto.randomUUID();
        body = { label: pair("label"), href: value("href"), published: formData.has("published"), order: Number(value("order")) };
      } else {
        id.current ??= crypto.randomUUID();
        body = {
          alt: pair("alt"), description: pair("description"), source: value("source"),
          published: formData.has("published"), order: Number(value("order")), image,
          ...(leader ? { name: pair("name"), role: pair("role") }
            : { title: pair("title"), category: value("category"), credit: value("credit") }),
        };
      }
      const path = settings ? "settings" : pageEditor ? "pages/" + page : contentEntry || menu ? mode + "/" + id.current : mode;
      await save(path, body);
      if (form.elements.image) form.elements.image.value = "";
      if (form.elements.resetLogo) form.elements.resetLogo.checked = false;
      setSaved(true);
    } catch (failure) {
      const key = Object.keys(failure.fields || {})[0]?.split(".")[0];
      const detail = copy[failure.message] || t.errors[failure.message] || t.errors.INTERNAL;
      const field = copy[key] || messages.social.platforms[key];
      setError(field ? `${field} · ${detail}` : detail);
    } finally {
      setBusy(false);
    }
  }

  return <form onSubmit={submit} onChange={() => setSaved(false)}>
    <fieldset disabled={busy} className="min-w-0 space-y-4">
      {(settings || leader) && <LanguageFields label={settings ? copy.siteName : copy.name} field="name" value={entry.name} max={100} required copy={copy} />}
      {settings && <div className="admin-editor-grid">
        {socialPlatforms.map((platform) => <Field key={platform} label={messages.social.platforms[platform]}>
          <Input name={platform} type="url" maxLength={500} dir="ltr" defaultValue={entry.social[platform]} placeholder="https://" />
        </Field>)}
      </div>}
      {contact && <>
        <LanguageFields label={copy.name} field="name" value={entry.name} max={100} copy={copy} />
        <LanguageFields label={copy.address} field="address" value={entry.address} max={300} copy={copy} />
        <div className="admin-editor-grid">
          <Field label={copy.phone}><Input name="phone" type="tel" dir="ltr" placeholder="+923005221884" defaultValue={entry.phone} pattern="\+[1-9][0-9]{6,14}" /></Field>
          <Field label={copy.email}><Input name="email" type="email" dir="ltr" maxLength={254} defaultValue={entry.email} /></Field>
        </div>
      </>}
      {leader && <LanguageFields label={copy.role} field="role" value={entry.role} max={80} required copy={copy} />}
      {mode === "gallery" && <LanguageFields label={copy.title} field="title" value={entry.title} max={120} required copy={copy} />}
      {pageEditor && entry.map(({ path, label, value }) =>
        <LanguageFields key={path} label={localized(label, locale)} field={path} value={value} max={3000}
          required multiline={Math.max(value.en.length, value.ur.length) > 90} copy={copy} />)}
      {menu && <>
        <LanguageFields label={copy.label} field="label" value={entry.label} max={80} required copy={copy} />
        <div className="admin-editor-grid">
          <Field label={copy.href}><Input name="href" dir="ltr" maxLength={500} defaultValue={entry.href} placeholder="/about-us" required /></Field>
          <Field label={copy.order}><Input name="order" type="number" min={0} max={9999} defaultValue={entry.order} required /></Field>
        </div>
        <label className="flex items-center gap-2 text-sm"><input name="published" type="checkbox" defaultChecked={entry.published} />{copy.published}</label>
      </>}
      {contentEntry && <>
        <LanguageFields label={copy.description} field="description" value={entry.description} max={1200} required={leader} multiline copy={copy} />
        <LanguageFields label={copy.alt} field="alt" value={entry.alt} max={160} copy={copy} />
        <div className="admin-editor-grid">
          <Field label={copy.source}><Input name="source" type="url" dir="ltr" maxLength={500} defaultValue={entry.source} /></Field>
          <Field label={copy.order}><Input name="order" type="number" min={0} max={9999} defaultValue={entry.order} required /></Field>
          {mode === "gallery" && <>
            <Field label={copy.category}><NativeSelect name="category" defaultValue={entry.category || "events"}>{galleryCategories.map((category) => <option key={category} value={category}>{messages.gallery[category]}</option>)}</NativeSelect></Field>
            <Field label={copy.credit}><Input name="credit" maxLength={120} defaultValue={entry.credit} /></Field>
          </>}
        </div>
        <label className="flex items-center gap-2 text-sm"><input name="published" type="checkbox" defaultChecked={entry.published} />{copy.published}</label>
      </>}
      {(settings || favicon || contentEntry) && <div className="flex min-w-0 items-end gap-3">
        <Photo src={settings ? entry.logo : favicon ? entry.favicon : entry.imageUrl} />
        <div className="min-w-0 flex-1">
          <Field label={settings ? copy.logo : favicon ? copy.favicon : copy.image}>
            <Input name="image" type="file" accept="image/jpeg,image/png,image/webp" required={contentEntry && !entry.id} />
          </Field>
          <p className="mt-1 text-xs text-muted-foreground">{copy.imageHint}</p>
        </div>
      </div>}
      {(settings || favicon) && <label className="flex items-center gap-2 text-sm"><input name="resetLogo" type="checkbox" />{settings ? copy.resetLogo : copy.resetFavicon}</label>}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit">{busy ? t.saving : t.save}</Button>
        {saved && <p role="status" className="text-sm text-primary">{copy.saved}</p>}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </div>
    </fieldset>
  </form>;
}

export function ImportWebsite({ sessionId }) {
  const { messages, locale } = useLanguage();
  const copy = messages.websiteAdmin;
  const cache = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function runImport() {
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const response = await api("/admin/website/import", { method: "POST" });
      await Promise.all([
        cache.invalidateQueries({ queryKey: ["admin", "website", sessionId] }),
        cache.invalidateQueries({ queryKey: websiteKey }),
      ]);
      setResult(response);
    } catch (failure) {
      const errors = messages.portal.errors;
      setError(errors[failure.message] || errors.INTERNAL);
    } finally {
      setBusy(false);
    }
  }

  return <>
    <DashboardLoading />
    <Card className="admin-editor-card space-y-3">
      <p className="text-sm text-muted-foreground">{copy.importHint}</p>
      <Button type="button" disabled={busy} onClick={runImport}>{busy ? copy.importing : copy.importContent}</Button>
      {result && <p role="status" className="text-sm text-primary">
        {result.imported ? copy.imported.replace("{count}", new Intl.NumberFormat(locale).format(result.imported)) : copy.alreadyImported}
      </p>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </Card>
  </>;
}

export function WebsiteEditor({ mode, sessionId }) {
  const { messages, locale, direction } = useLanguage();
  const copy = messages.websiteAdmin;
  const t = messages.portal;
  const cache = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState("home");
  const queryKey = ["admin", "website", sessionId];
  const { data, error, isFetching } = useQuery({
    queryKey,
    queryFn: () => api("/admin/website"),
    retry: false,
  });

  async function save(path, body) {
    await api("/admin/website/" + path, { method: "PUT", body });
    setEditing(null);
    await Promise.all([
      cache.invalidateQueries({ queryKey }),
      cache.invalidateQueries({ queryKey: websiteKey }),
    ]);
  }

  return <>
    <DashboardLoading busy={isFetching && !data} />
    {error && <p role="alert">{t.errors[error.message] || t.errors.INTERNAL}</p>}
    {data && renderEditor()}
  </>;

  function renderEditor() {
    if (mode === "branding") return <div className="space-y-4">
      <Card className="admin-editor-card"><EditorForm mode={mode} entry={data.settings} save={save} /></Card>
      <Card className="admin-editor-card"><EditorForm mode="favicon" entry={data.settings} save={save} /></Card>
    </div>;
    if (mode === "contact") return <Card className="admin-editor-card"><EditorForm mode={mode} entry={data.contact} save={save} /></Card>;
    if (mode === "pages") return <Card className="admin-editor-card space-y-4">
      <div className="max-w-72 space-y-1">
        <label htmlFor="website-editor-page" className="block text-sm font-semibold">{copy.selectPage}</label>
        <Select value={page} onValueChange={setPage} dir={direction}>
          <SelectTrigger id="website-editor-page"><SelectValue /></SelectTrigger>
          <SelectContent align="start">
            {Object.keys(data.pages).map((key) => <SelectItem key={key} value={key}>{copy.pageNames[key]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <EditorForm key={page} mode={mode} page={page} entry={data.pages[page] || []} save={save} />
    </Card>;
    const entries = data[mode];
    const titleField = mode === "leaders" ? "name" : mode === "menu" ? "label" : "title";
    const nextOrder = Math.min(9999, Math.max(-1, ...entries.map(({ order }) => order)) + 1);
    return <>
      <div className="mb-3 flex justify-end">
        <Button type="button" onClick={() => setEditing({ order: nextOrder, published: true })}><Plus aria-hidden="true" />{copy.add}</Button>
      </div>
      <Card className="admin-editor-list admin-table-card">
        <Table>
          <TableHeader><TableRow><TableHead>{copy[titleField]}</TableHead><TableHead>{copy.status}</TableHead><TableHead>{copy.order}</TableHead><TableHead>{copy.actions}</TableHead></TableRow></TableHeader>
          <TableBody>{entries.map((entry) => <TableRow key={entry.id}>
            <TableCell data-label={copy[titleField]}><div className="flex min-w-0 items-center gap-2">
              <Photo src={entry.imageUrl} />
              <span className="whitespace-normal break-words font-semibold">{localized(entry[titleField], locale)}</span>
            </div></TableCell>
            <TableCell data-label={copy.status}>{entry.published ? copy.published : copy.hidden}</TableCell>
            <TableCell data-label={copy.order}>{entry.order}</TableCell>
            <TableCell data-label={copy.actions}><Button type="button" variant="outline" size="sm" onClick={() => setEditing(entry)}>{copy.edit}</Button></TableCell>
          </TableRow>)}</TableBody>
        </Table>
        {!entries.length && <p className="admin-table-empty">{t.empty}</p>}
      </Card>
      <Dialog open={!!editing} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        {editing && <DialogContent aria-describedby={undefined} dir={direction} closeLabel={messages.common.close} className="admin-editor-dialog">
          <DialogTitle className="heading-card">{editing.id ? copy.edit : copy.add} · {copy[mode]}</DialogTitle>
          <EditorForm mode={mode} entry={editing} save={save} />
        </DialogContent>}
      </Dialog>
    </>;
  }
}
