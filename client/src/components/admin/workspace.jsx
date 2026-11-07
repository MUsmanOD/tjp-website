"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Overview, StatusCards } from "./overview";
import { HeadingFilters } from "./heading-filters";
import { MemberRecords } from "./member-records";
import { SessionRecords } from "./session-records";
import { SecurityRecords } from "./security-records";
import { ImportWebsite, WebsiteEditor, websiteViews } from "./website-editor";
import { ContactInbox } from "./contact-inbox";
import {
  LayoutDashboard,
  Users,
  MonitorSmartphone,
  ShieldCheck,
  LogOut,
  Menu,
  MapPinned,
  ChevronRight,
  Settings,
  MapPin,
  Images,
  ContactRound,
  Inbox,
  Plus,
  PanelsTopLeft,
  Palette,
  List,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeSelect } from "./theme-select";
import { AdminLanguageMenu } from "./language-menu";
import { SecuritySettings } from "./security-settings";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/components/providers/language-provider";
import { DashboardLoading, LogoLoading } from "@/components/providers/website-loading";
import { Brand } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ApplicationForm } from "@/components/membership/application-form";
import { api, clearAuth } from "@/lib/portal-api";
import { portalPath, portalDashboardPath } from "@/config/portal";
const navIcons = {
  overview: LayoutDashboard, members: Users,
  pages: PanelsTopLeft, branding: Palette, menu: List,
  contact: MapPin, leaders: ContactRound, gallery: Images, inbox: Inbox,
  sessions: MonitorSmartphone, security: ShieldCheck, settings: Settings,
};

export function AdminWorkspace() {
  const { messages, locale } = useLanguage(),
    t = messages.portal,
    router = useRouter(),
    params = useSearchParams(),
    cache = useQueryClient();
  const [identity, setIdentity] = useState(null),
    [error, setError] = useState(""),
    [member, setMember] = useState(null),
    [edit, setEdit] = useState(false),
    [addingMember, setAddingMember] = useState(false),
    [action, setAction] = useState(null),
    [names, setNames] = useState({}),
    [mobileOpen, setMobileOpen] = useState(false),
    [searchResult, setSearchResult] = useState(null);
  const requestedView = params.get("view");
  const mode = Object.hasOwn(navIcons, requestedView) ? requestedView : "overview";
  const websiteView = websiteViews.includes(mode);
  const viewLabel = (view) => messages.websiteAdmin[view] || t[view];
  const placeName = (value) =>
    value === "__none__"
      ? t.unspecified
      : (Object.hasOwn(t.regionNames, value)
          ? t.regionNames[value]
          : undefined) ||
        (Object.hasOwn(names, value) ? names[value]?.[locale] : undefined) ||
        value;
  useEffect(() => {
    let active = true;
    api("/locations/catalogue")
      .then((data) => {
        if (active) setNames(data.names);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!identity) return;
    const expire = () => window.dispatchEvent(new Event("tjp-session-expired"));
    let timer;
    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(
        expire,
        Math.max(
          0,
          Math.min(
            1800000,
            new Date(identity.expiresAt).getTime() - Date.now(),
          ),
        ),
      );
    };
    arm();
    window.addEventListener("tjp-auth-activity", arm);
    const channel =
      typeof BroadcastChannel !== "undefined"
        ? new BroadcastChannel("tjp-auth")
        : null;
    if (channel) channel.onmessage = expire;
    return () => {
      clearTimeout(timer);
      window.removeEventListener("tjp-auth-activity", arm);
      channel?.close();
    };
  }, [identity]);
  useEffect(() => {
    const expired = () => {
      cache.clear();
      setMember(null);
      setAddingMember(false);
      setSearchResult(null);
      clearAuth();
      router.replace(portalPath);
    };
    window.addEventListener("tjp-session-expired", expired);
    api("/auth/me").then(setIdentity).catch(expired);
    return () => {
      window.removeEventListener("tjp-session-expired", expired);
      cache.clear();
    };
  }, [router, cache]);

  const query = params.toString();
  const {
    data: result,
    error: loadError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin", identity?.sessionId, mode, query],
    enabled: !!identity && !websiteView,
    queryFn: () => workspaceData(mode, query),
    retry: false,
    gcTime: 0,
    staleTime: 0,
  });
  const stats = result?.stats,
    tree = result?.tree || [],
    sessions = result?.sessions || [],
    listing =
      searchResult?.query === query ? searchResult.data : result?.listing;
  const load = useCallback(async () => {
    setSearchResult(null);
    await refetch();
  }, [refetch]);
  function navigate(changes) {
    const q = new URLSearchParams(params);
    for (const [k, v] of Object.entries(changes)) {
      if (v) q.set(k, v);
      else q.delete(k);
    }
    setMobileOpen(false);
    router.push(portalDashboardPath + "?" + q);
  }
  async function open(id) {
    try {
      setMember(await api("/admin/memberships/" + id));
      setEdit(false);
    } catch (e) {
      setError(e.message);
    }
  }
  async function status(value) {
    try {
      await api("/admin/memberships/" + member.id + "/status", {
        method: "POST",
        body: { status: value },
      });
      await open(member.id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }
  async function confirm(e) {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await api("/auth/step-up", { method: "POST", body });
      if (action === "reveal") {
        const value = await api("/admin/memberships/" + member.id + "/reveal", {
          method: "POST",
        });
        setMember((old) => ({ ...old, ...value }));
      } else if (action === "remove") {
        await api("/admin/memberships/" + member.id, { method: "DELETE" });
        setMember(null);
        await load();
      } else if (action !== "verify") {
        await api("/auth/sessions/" + action, { method: "DELETE" });
        await load();
      }
      setAction(null);
    } catch (e) {
      setError(e.message);
    }
  }
  const navigation = (
    <>
      <div className="admin-brand">
        <Brand compact showWordmark />
      </div>
      <p className="admin-sidebar-label" aria-hidden="true">{t.workspace}</p>
      <nav aria-label={t.workspace} className="admin-navigation" data-lenis-prevent>
        {Object.keys(navIcons).map((view) => (
          <Link
            key={view}
            href={portalDashboardPath + "?view=" + view}
            onClick={() => setMobileOpen(false)}
            aria-current={mode === view ? "page" : undefined}
            className={"admin-nav-link " + (mode === view ? "is-active" : "")}
          >
            {(() => {
              const Icon = navIcons[view];
              return <Icon aria-hidden="true" />;
            })()}
            <span>{viewLabel(view)}</span>
          </Link>
        ))}
      </nav>
      <div className="admin-sidebar-footer">
        <Button
          type="button"
          variant="plain"
          className="admin-signout w-full justify-start"
          onClick={async () => {
            try {
              await api("/auth/logout", { method: "POST" });
            } catch (error) {
              setError(error.message);
              return;
            }
            {
              cache.clear();
              setIdentity(null);
              setMember(null);
              setAddingMember(false);
              setSearchResult(null);
              clearAuth();
              const channel = new BroadcastChannel("tjp-auth");
              channel.postMessage("logout");
              channel.close();
              router.replace(portalPath);
            }
          }}
        >
          <LogOut aria-hidden="true" />
          {t.logout}
        </Button>
      </div>
    </>
  );
  if (!identity)
    return (
      <main id="main-content">
        <LogoLoading />
      </main>
    );
  const group = params.get("group") || "country";
  return (
    <main id="main-content" className="admin-dashboard-page">
      <div className="admin-shell">
        <aside className="admin-sidebar hidden lg:block">
          <div className="flex h-full min-h-0 w-full flex-col">
            {navigation}
          </div>
        </aside>
        <section className="admin-main">
          <header className="admin-topbar">
            <Button type="button" variant="outline" size="sm" className="lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu aria-hidden="true" />{t.menu}
            </Button>
            <div className="admin-topbar-actions">
              <ThemeSelect />
              <AdminLanguageMenu />
            </div>
          </header>
          <div className="admin-dashboard-content w-full">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetContent
                side={locale === "ur" ? "right" : "left"}
                closeLabel={messages.common.close}
                className="admin-mobile-sidebar w-[min(20rem,calc(100vw_-_1.5rem))] overflow-hidden p-4"
              >
                <SheetTitle className="sr-only">{t.workspace}</SheetTitle>
                <SheetDescription className="sr-only">{t.menu}</SheetDescription>
                <div className="flex min-h-0 flex-1 flex-col">{navigation}</div>
              </SheetContent>
            </Sheet>
            <div className="admin-page-heading">
              <div>
                <h1>{viewLabel(mode)}</h1>
              </div>
              {!websiteView && <HeadingFilters key={mode + ":" + query} mode={mode} params={params} navigate={navigate} t={t} />}
            </div>
            {mode === "inbox" && <ContactInbox sessionId={identity.sessionId} />}
            {mode === "settings" && <ImportWebsite sessionId={identity.sessionId} />}
            {websiteView && mode !== "inbox" && mode !== "settings" &&
              <WebsiteEditor key={mode} mode={mode} sessionId={identity.sessionId} />}
            {(error || loadError) && <p role="alert" className="my-4">
              {error ? t.errors[error] || t.errors.INTERNAL : t.errors[loadError.message] || t.errors.INTERNAL}
            </p>}
            {!websiteView && <DashboardLoading key={mode} busy={isFetching && !result} />}
            {(mode === "overview" || mode === "members") && stats && <StatusCards stats={stats} variant={mode} />}
            {mode === "overview" && listing && <MemberRecords listing={listing} t={t} locale={locale} placeName={placeName} open={open} navigate={navigate} />}
            {mode === "overview" && stats && <Overview stats={stats} />}
            {mode === "sessions" && result && <SessionRecords sessions={sessions} identity={identity} locale={locale} t={t} params={params} navigate={navigate} setAction={setAction} />}
            {mode === "security" && <>
              <SecurityRecords identity={identity} locale={locale} t={t} params={params} />
              <SecuritySettings identity={identity} onChanged={async () => {
                cache.clear();
                setIdentity(await api("/auth/me"));
              }} />
            </>}
            {mode === "members" && (
              <>
                <div className="flex justify-end">
                  <Button type="button" size="sm" onClick={() => setAddingMember(true)}>
                    <Plus aria-hidden="true" />{messages.websiteAdmin.addMember}
                  </Button>
                </div>
                <form
                  className="admin-search"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      setSearchResult({
                        query,
                        data: await api("/admin/memberships/search", {
                          method: "POST",
                          body: Object.fromEntries(
                            new FormData(e.currentTarget),
                          ),
                        }),
                      });
                    } catch (err) {
                      setError(err.message);
                    }
                  }}
                >
                  <Select
                    name="field"
                    defaultValue="name"
                    dir={locale === "ur" ? "rtl" : "ltr"}
                  >
                    <SelectTrigger
                      aria-label={t.search}
                      className="admin-search-select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["name", "email", "phone", "identity", "reference"].map(
                        (k) => (
                          <SelectItem key={k} value={k}>
                            {t[k]}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <Input
                    name="value"
                    required
                    aria-label={t.exactSearch}
                    placeholder={t.exactSearch}
                    className="sm:max-w-xs"
                  />
                  <Button>{t.search}</Button>
                </form>
                {listing && <MemberRecords listing={listing} t={t} locale={locale} placeName={placeName} open={open} navigate={navigate} />}
                <div className="admin-section-heading">
                  <div>
                    <h2>{t.dashboardUi.browseByLocation}</h2>
                  </div>
                  <MapPinned aria-hidden="true" />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => router.push(portalDashboardPath + "?view=members")}
                  >
                    {t.all}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(portalDashboardPath + "?view=members&group=region")
                    }
                  >
                    {t.homeArea}
                  </Button>
                  {[
                    "country",
                    "region",
                    "district",
                    "locality",
                    "overseasRegion",
                    "overseasCity",
                  ]
                    .filter((k) => params.get(k))
                    .map((k) => (
                      <button
                        className="rounded border px-3 py-2"
                        key={k}
                        onClick={() => {
                          const q = new URLSearchParams(params);
                          const levels = [
                            "country",
                            "region",
                            "district",
                            "locality",
                            "overseasRegion",
                            "overseasCity",
                          ];
                          const index = levels.indexOf(k);
                          for (const level of levels.slice(index))
                            q.delete(level);
                          q.set("group", k);
                          q.delete("page");
                          router.push(portalDashboardPath + "?" + q);
                        }}
                      >
                        {t[k]}: {placeName(params.get(k))}
                      </button>
                    ))}
                </div>
                <div className="my-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {tree.map((item) => (
                    <button
                      key={item._id || "empty"}
                      className="admin-location-card"
                      onClick={() => {
                        const g =
                          group === "country"
                            ? item._id === "PK"
                              ? "region"
                              : "overseasRegion"
                            : {
                                region: "district",
                                district: "locality",
                                overseasRegion: "overseasCity",
                              }[group];
                        navigate({
                          [group]: item._id,
                          group: g || group,
                          page: "",
                        });
                      }}
                    >
                      <span className="admin-location-icon">
                        <MapPinned aria-hidden="true" />
                      </span>
                      <span className="admin-location-name">
                        {placeName(item._id) || t.unspecified}
                        <small>
                          {new Intl.NumberFormat(locale).format(item.count)} ·{" "}
                          {t.members}
                        </small>
                      </span>
                      <ChevronRight
                        className="admin-location-arrow rtl:rotate-180"
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
      <Dialog open={addingMember && mode === "members"} onOpenChange={setAddingMember}>
        {addingMember && mode === "members" && <DialogContent
          closeLabel={messages.common.close}
          className="admin-editor-dialog"
          aria-describedby={undefined}
        >
          <DialogTitle className="heading-card">{messages.websiteAdmin.addMember}</DialogTitle>
          <ApplicationForm onAdminCreate={async ({ id }) => {
            setAddingMember(false);
            await open(id);
            await load();
          }} />
        </DialogContent>}
      </Dialog>
      <Dialog
        open={!!member}
        onOpenChange={(open) => {
          if (!open) {
            setMember(null);
            setEdit(false);
          }
        }}
      >
        <DialogContent
          closeLabel={messages.common.close}
          className="max-h-[90svh] w-[95vw] max-w-4xl overflow-y-auto p-6"
        >
          <DialogTitle className="heading-section">{member?.name}</DialogTitle>
          <DialogDescription>{t.profile}</DialogDescription>
          {member &&
            (edit ? (
              <ApplicationForm
                initial={{
                  ...member,
                  identityLocked: member.identity.includes("*"),
                  identity: member.identity.includes("*")
                    ? ""
                    : member.identity,
                }}
                onSave={async (data) => {
                  await api("/admin/memberships/" + member.id, {
                    method: "PATCH",
                    body: {
                      ...data,
                      ...(member.identity.includes("*")
                        ? { identity: undefined }
                        : {}),
                    },
                    headers: { "If-Match": member.updatedAt },
                  });
                  await open(member.id);
                  await load();
                }}
              />
            ) : (
              <>
                <div className="admin-profile-table my-6">
                <Table>
                <TableBody>
                  {[
                    "name",
                    "reference",
                    "status",
                    "membershipNumber",
                    "createdAt",
                    "email",
                    "phone",
                    "gender",
                    "religiousCommunity",
                    "age",
                    "ageGroup",
                    "identity",
                    "country",
                    "overseasRegion",
                    "overseasCity",
                    "region",
                    "district",
                    "locality",
                    "national",
                    "assembly",
                    "union",
                    "ward",
                    "education",
                    "profession",
                    "occupation",
                    "interests",
                  ].map((k) => {
                    const value = member[k];
                    const label = ["status", "gender", "religiousCommunity", "ageGroup", "education", "profession"].includes(k)
                      ? t[value] || value
                      : ["country", "region", "district", "locality"].includes(k)
                        ? placeName(value)
                        : k === "createdAt" && value
                          ? new Date(value).toLocaleDateString(locale)
                          : value;
                    return (
                      <TableRow key={k}>
                        <th scope="row">{t[k]}</th>
                        <TableCell>{k === "status" && value ? <Badge className={"admin-status admin-status-" + value}>{label}</Badge> : label ?? "—"}{label === "" ? "—" : null}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                </Table>
                </div>
                <p>
                  {t.duplicates}: {member.duplicates?.length || 0}
                </p>
                <div className="my-5 flex flex-wrap gap-2">
                  <Button onClick={() => setEdit(true)}>{t.edit}</Button>
                  <Button variant="outline" onClick={() => setAction("verify")}>
                    {t.confirmIdentity}
                  </Button>
                  <Button variant="outline" onClick={() => setAction("reveal")}>
                    {t.reveal}
                  </Button>
                  {(member.status === "archived"
                    ? ["restore"]
                    : ["approved", "rejected", "archived"]
                  ).map((s) => (
                    <Button variant="outline" key={s} onClick={() => status(s)}>
                      {t[s]}
                    </Button>
                  ))}
                  <Button variant="outline" onClick={() => setAction("remove")}>
                    {t.remove}
                  </Button>
                </div>
                <h3 className="heading-card">{t.history}</h3>
                {member.history?.map((h) => (
                  <p key={h._id} className="text-small border-b py-2">
                    {t.audit[h.action] || t.history} ·{" "}
                    {new Date(h.createdAt).toLocaleString(locale)}
                  </p>
                ))}
              </>
            ))}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!action}
        onOpenChange={(open) => {
          if (!open) setAction(null);
        }}
      >
        <DialogContent
          closeLabel={messages.common.close}
          className="max-w-md p-6"
        >
          <DialogTitle>{t.confirmIdentity}</DialogTitle>
          <DialogDescription>
            {action === "remove"
              ? t.removeDataWarning
              : identity.mfaEnabled
                ? t.stepUpHelp
                : t.passwordConfirmationHelp}
          </DialogDescription>
          <form className="mt-5 space-y-4" onSubmit={confirm}>
            <label>
              {t.password}
              <Input
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </label>
            {identity.mfaEnabled && (
              <label>
                {t.code}
                <Input name="code" autoComplete="one-time-code" required />
              </label>
            )}
            <p role="alert">
              {error ? t.errors[error] || t.errors.INTERNAL : ""}
            </p>
            <Button>{t.confirm}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

async function workspaceData(mode, query) {
  if (mode === "security") return {};
  if (mode === "sessions") return { sessions: await api("/auth/sessions") };
  const stats = api("/admin/analytics");
  if (mode === "overview") {
    const q = new URLSearchParams(query);
    q.delete("view");
    const [summary, listing] = await Promise.all([stats, api("/admin/memberships?" + q)]);
    return { stats: summary, listing };
  }
  const q = new URLSearchParams(query);
  q.delete("view");
  const group = q.get("group") || "country";
  q.delete("group");
  const [summary, listing, tree] = await Promise.all([
    stats,
    api("/admin/memberships?" + q),
    api("/admin/memberships/tree?" + q + "&group=" + group),
  ]);
  return { stats: summary, listing, tree };
}
