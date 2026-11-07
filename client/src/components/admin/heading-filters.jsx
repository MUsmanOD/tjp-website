"use client";

import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const memberOptions = [
  ["status", ["pending", "approved", "rejected", "archived"]],
  ["ageGroup", ["under18", "age18to29", "age30to49", "age50plus", "adult"]],
  ["manual", ["true", "false"]],
];
const memberTextFields = ["from", "to", "national", "assembly", "union", "ward"];

export function HeadingFilters({ mode, params, navigate, t }) {
  const isMembership = mode === "overview" || mode === "members";
  const clear = () => navigate({
    status: "", ageGroup: "", manual: "", from: "", to: "",
    national: "", assembly: "", union: "", ward: "",
    sessionScope: "", mfa: "", page: "",
  });
  return (
    <details className="admin-heading-filters">
      <summary><SlidersHorizontal aria-hidden="true" /><span>{t.dashboardUi.refineResults}</span><ChevronDown aria-hidden="true" /></summary>
      <div className="admin-heading-filter-panel">
        <form className="grid gap-3 sm:grid-cols-2" onSubmit={(event) => {
          event.preventDefault();
          navigate({
            ...Object.fromEntries([...new FormData(event.currentTarget)].map(([key, value]) => [key, value === "all" ? "" : value])),
            page: "",
          });
        }}>
          {isMembership && <>
            {memberOptions.map(([field, options]) => (
              <label className="form-label" key={field}>
                {t[field]}
                <select className="form-input mt-1 w-full" name={field} defaultValue={params.get(field) || "all"}>
                  <option value="all">{t.all}</option>
                  {options.map((value) => <option key={value} value={value}>{field === "manual" ? value === "true" ? t.yes : t.no : t[value]}</option>)}
                </select>
              </label>
            ))}
            {memberTextFields.map((field) => (
              <label className="form-label" key={field}>
                {t[field]}
                <Input className="mt-1" name={field} type={field === "from" || field === "to" ? "date" : "text"} defaultValue={params.get(field) || ""} />
              </label>
            ))}
          </>}
          {mode === "sessions" && <label className="form-label sm:col-span-2">
            {t.session}
            <select className="form-input mt-1 w-full" name="sessionScope" defaultValue={params.get("sessionScope") || "all"}>
              <option value="all">{t.all}</option>
              <option value="current">{t.currentSession}</option>
              <option value="other">{t.session}</option>
            </select>
          </label>}
          {mode === "security" && <label className="form-label sm:col-span-2">
            {t.twoFactor}
            <select className="form-input mt-1 w-full" name="mfa" defaultValue={params.get("mfa") || "all"}>
              <option value="all">{t.all}</option>
              <option value="enabled">{t.twoFactorOn}</option>
              <option value="disabled">{t.twoFactorOff}</option>
            </select>
          </label>}
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit">{t.filter}</Button>
            <Button type="button" variant="outline" onClick={clear}>{t.all}</Button>
          </div>
        </form>
      </div>
    </details>
  );
}
