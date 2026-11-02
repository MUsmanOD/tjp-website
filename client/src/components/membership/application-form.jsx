"use client";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationPicker } from "@/components/forms/location-picker";
import { api } from "@/lib/portal-api";
const blank = {
  name: "",
  email: "",
  phone: "",
  ageGroup: "",
  gender: "",
  religiousCommunity: "",
  age: null,
  identity: "",
  identityType: "cnic",
  country: "PK",
  overseasRegion: "",
  overseasCity: "",
  region: "",
  district: "",
  locality: "",
  districtManual: false,
  localityManual: false,
  national: "",
  assembly: "",
  nationalManual: false,
  assemblyManual: false,
  union: "",
  ward: "",
  occupation: "",
  interests: "",
  consent: false,
};
export function ApplicationForm({ initial, onSave }) {
  const { messages, locale, direction } = useLanguage(),
    t = messages.portal;
  const [data, setData] = useState(
      initial
        ? Object.fromEntries(
            Object.keys(blank).map((k) => [k, initial[k] ?? blank[k]]),
          )
        : blank,
    ),
    [errors, setErrors] = useState({}),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [reference, setReference] = useState(""),
    [applicantName, setApplicantName] = useState(""),
    [countries, setCountries] = useState([]),
    [regions, setRegions] = useState([]),
    [districts, setDistricts] = useState([]),
    [localities, setLocalities] = useState([]),
    [electoral, setElectoral] = useState({ national: [], assembly: [] });
  const key = useRef(null),
    summary = useRef(null),
    confirmation = useRef(null);
  useEffect(() => {
    if (reference) confirmation.current?.focus();
  }, [reference]);
  useEffect(() => {
    let live = true;
    Promise.all([api("/locations/countries"), api("/locations/regions")])
      .then(([c, r]) => {
        if (live) {
          setCountries(c);
          setRegions(r);
        }
      })
      .catch(() => {
        if (live) setNotice("INTERNAL");
      });
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => {
    let active = true;

    api("/locations/districts?region=" + encodeURIComponent(data.region))
      .then((v) => {
        if (active) setDistricts(v);
      })
      .catch(() => setNotice("INTERNAL"));
    return () => {
      active = false;
    };
  }, [data.region]);
  useEffect(() => {
    let active = true;

    api(
      "/locations/localities?region=" +
        encodeURIComponent(data.region) +
        "&district=" +
        encodeURIComponent(data.district),
    )
      .then((v) => {
        if (active) setLocalities(v);
      })
      .catch(() => setNotice("INTERNAL"));
    return () => {
      active = false;
    };
  }, [data.region, data.district]);
  useEffect(() => {
    let live = true;
    Promise.all(
      ["national", "assembly"].map((kind) =>
        api(
          "/locations/constituencies?region=" +
            encodeURIComponent(data.region) +
            "&kind=" +
            kind,
        ),
      ),
    )
      .then(([national, assembly]) => {
        if (live) setElectoral({ national, assembly });
      })
      .catch(() => setNotice("INTERNAL"));
    return () => {
      live = false;
    };
  }, [data.region]);
  const constituency = (name) => (
    <LocationPicker
      name={name}
      value={data[name]}
      options={electoral[name]}
      manual={data[name + "Manual"]}
      disabled={!data.region}
      error={errors[name]}
      onManual={() => {}}
      onChange={(value, manual = data[name + "Manual"]) => {
        change(name, value);
        setData((old) => ({ ...old, [name + "Manual"]: manual }));
      }}
    />
  );
  const change = (name, value) => {
    if (name === "region") {
      setDistricts([]);
      setLocalities([]);
    }
    if (name === "district") setLocalities([]);
    setData((old) => ({
      ...old,
      [name]: value,
      ...(name === "region"
        ? {
            district: "",
            locality: "",
            districtManual: false,
            localityManual: false,
            national: "",
            assembly: "",
            nationalManual: false,
            assemblyManual: false,
          }
        : {}),
      ...(name === "district" ? { locality: "", localityManual: false } : {}),
      ...(name === "country" ? { overseasCity: "", overseasRegion: "", identityType: value === "PK" ? "cnic" : "nicop" } : {}),
    }));
    setErrors((old) => ({ ...old, [name]: undefined, ...((name === "ward" || name === "union") && value.trim() ? { union: undefined } : {}) }));
  };
  const field = (name, required = false, type = "text") => (
    <div key={name}>
      <label className="form-label" htmlFor={"application-" + name}>
        {name === "identity" ? (data.country === "PK" ? t.cnicNumber : t.nicopNumber) : t[name]} {required ? "*" : `(${t.optional})`}
      </label>
      <Input
        id={"application-" + name}
        name={name}
        type={type}
        disabled={!!initial?.identityLocked && name === "identity"}
        dir={
          ["email", "tel"].includes(type) ||
          ["identity", "national", "assembly"].includes(name)
            ? "ltr"
            : "auto"
        }
        value={data[name] ?? ""}
        onChange={(e) => change(name, name === "age" ? (e.target.value === "" ? null : Number(e.target.value)) : e.target.value)}
        min={name === "age" ? 1 : undefined}
        max={name === "age" ? 120 : undefined}
        maxLength={name === "interests" ? 500 : 150}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? name + "-error" : undefined}
      />
      {errors[name] && (
        <p id={name + "-error"} className="text-small mt-1" role="alert">
          {t.errors[errors[name]] || t.errors.INVALID}
        </p>
      )}
    </div>
  );
  const select = (name, options, required = true) => (
    <div key={name}>
      <label className="form-label" htmlFor={"application-" + name}>
        {t[name]} {required ? "*" : `(${t.optional})`}
      </label>
      <Select
        dir={direction}
        value={data[name]}
        onValueChange={(v) => change(name, v)}
      >
        <SelectTrigger id={"application-" + name} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? name + "-error" : undefined}>
          <SelectValue placeholder={t.choose} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.id} value={o.id}>
              {o[locale] || o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors[name] && (
        <p id={name + "-error"} role="alert" className="text-small">
          {t.errors[errors[name]] || t.errors.INVALID}
        </p>
      )}
    </div>
  );
  async function submit(e) {
    e.preventDefault();
    setNotice("");
    const invalid = {};
    for (const name of ["name", "ageGroup", "region", "district", "locality"])
      if (!data[name].trim()) invalid[name] = "REQUIRED";
    if (data.name.trim() && data.name.trim().length < 2) invalid.name = "INVALID";
    if (data.age !== null && (!Number.isInteger(data.age) || data.age < 1 || data.age > 120)) invalid.age = "INVALID";
    if (!initial && !data.gender) invalid.gender = "REQUIRED";
    if (!initial && !data.religiousCommunity) invalid.religiousCommunity = "REQUIRED";
    if (!data.email && !data.phone) invalid.email = "CONTACT_REQUIRED";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      invalid.email = "INVALID";
    if (data.country !== "PK" && !data.overseasCity.trim()) invalid.overseasCity = "REQUIRED";
    if (!data.union.trim() && !data.ward.trim()) invalid.union = "LOCAL_REQUIRED";
    if (data.region && !["ajk", "gb"].includes(data.region) && !data.national.trim()) invalid.national = "REQUIRED";
    if (data.region && data.region !== "ict" && !data.assembly.trim()) invalid.assembly = "REQUIRED";
    if (!data.consent) invalid.consent = "REQUIRED";
    if (Object.keys(invalid).length) {
      setErrors(invalid);
      summary.current?.focus();
      return;
    }
    setBusy(true);
    try {
      if (onSave) {
        await onSave(data);
        setNotice("SAVED");
      } else {
        const payload = JSON.stringify(data);
        if (key.current?.payload !== payload)
          key.current = { payload, id: crypto.randomUUID() };
        const result = await api("/memberships", {
          method: "POST",
          body: data,
          headers: { "Idempotency-Key": key.current.id },
        });
        setApplicantName(data.name.trim());
        setReference(result.reference);
        setData(blank);
        key.current = null;
      }
    } catch (error) {
      setErrors(error.fields || {});
      setNotice(error.message);
      summary.current?.focus();
    } finally {
      setBusy(false);
    }
  }
  if (reference)
    return (
      <div ref={confirmation} tabIndex={-1} role="status" className="membership-success">
        <div className="membership-success-icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none"><path d="M13 24.5 20.5 32 35.5 16" /></svg>
        </div>
        <p className="membership-success-eyebrow">{t.applicationSubmitted}</p>
        <h2 className="membership-success-title">{t.thankYou}, <bdi>{applicantName}</bdi>.</h2>
        <p className="membership-success-description">{t.receivedText}</p>
        <div className="membership-success-reference">
          <span>{t.reference}</span>
          <strong dir="ltr">{reference}</strong>
        </div>
      </div>
    );
  return (
    <form noValidate onSubmit={submit} className="membership-form space-y-6">
      <div ref={summary} tabIndex={-1} role="alert">
        {notice && notice !== "VALIDATION" && (t.errors[notice] || t.errors.INTERNAL)}
        {Object.values(errors).some(Boolean) && <><p>{t.fixErrors}</p><ul className="mt-2 list-inside list-disc">{Object.entries(errors).filter(([, code]) => code).map(([name, code]) => <li key={name}><a className="text-link" href={"#application-" + name} onClick={(event) => { event.preventDefault(); document.getElementById("application-" + name)?.focus(); }}>{t[name] || name}: {t.errors[code] || t.errors.INVALID}</a></li>)}</ul></>}
      </div>
      <fieldset className="space-y-5">
        <legend className="heading-card mb-5">{t.personal}</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          {field("name", true)}
          {select("gender", [
            { id: "male", label: t.male },
            { id: "female", label: t.female },
          ], !initial)}
          {select("religiousCommunity", [
            { id: "muslim", label: t.muslim },
            { id: "minority", label: t.minority },
          ], !initial)}
          {select("ageGroup", [
            { id: "under18", label: t.under18 },
            { id: "age18to29", label: t.age18to29 },
            { id: "age30to49", label: t.age30to49 },
            { id: "age50plus", label: t.age50plus },
            ...(initial?.ageGroup === "adult" ? [{ id: "adult", label: t.adult }] : []),
          ])}
          {initial?.age != null && field("age", false, "number")}
          {field("email", false, "email")}
          {field("phone", false, "tel")}
          <LocationPicker name="country" value={data.country} options={countries} onChange={(v) => change("country", v)} error={errors.country} />
          {field("identity")}
        </div>
        <p className="text-small text-muted-foreground">{t.contactHelp}</p>
      </fieldset>
      <fieldset className="space-y-5 border-t pt-6">
        <legend className="heading-card mb-5">{t.location}</legend>
        {data.country !== "PK" && (
          <div className="grid gap-5 sm:grid-cols-2">
            {field("overseasRegion")}
            {field("overseasCity", true)}
          </div>
        )}
        <p className="text-small text-muted-foreground">{t.homeHelp}</p>
        <div className="grid gap-5 sm:grid-cols-3">
          {select("region", regions)}
          {["district", "locality"].map((name) => (
            <LocationPicker
              key={name}
              name={name}
              value={data[name]}
              options={name === "district" ? districts : localities}
              manual={data[name + "Manual"]}
              disabled={!data.region || (name === "locality" && !data.district)}
              error={errors[name]}
              onManual={() => {}}
              onChange={(value, manual = data[name + "Manual"]) => {
                change(name, value);
                setData((old) => ({ ...old, [name + "Manual"]: manual }));
              }}
            />
          ))}
        </div>
      </fieldset>
      <fieldset className="space-y-5 border-t pt-6">
        <legend className="heading-card mb-5">{t.electoral}</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          {field("union")}
          {field("ward")}
          {!["ajk", "gb"].includes(data.region) && constituency("national")}
          {data.region !== "ict" && constituency("assembly")}
        </div>
        <label className="membership-consent flex items-start gap-3">
          <input
            id="application-consent"
            className="mt-1 size-5"
            type="checkbox"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            checked={data.consent}
            onChange={(e) => change("consent", e.target.checked)}
          />
          <span>{t.consent}</span>
        </label>
        {errors.consent && <p id="consent-error" role="alert">{t.errors.REQUIRED}</p>}
      </fieldset>
      <div className="flex justify-end">
        <Button size="lg" disabled={busy}>
          {busy ? t.saving : onSave ? t.save : t.submit}
        </Button>
      </div>
    </form>
  );
}
