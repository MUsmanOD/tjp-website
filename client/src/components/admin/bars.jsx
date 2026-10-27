"use client";
import { BarChart3 } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
export function Bars({ values, variant }) {
  const { messages, locale } = useLanguage(),
    max = Math.max(1, ...values.map((v) => v.value));
  if (!values.length)
    return (
      <div className="admin-chart-empty">
        <BarChart3 aria-hidden="true" />
        <strong>{messages.portal.dashboardUi.noActivity}</strong>
      </div>
    );
  if (variant === "chart")
    return (
      <div
        className="admin-column-chart"
        role="list"
        aria-label={messages.portal.applicationsTrend}
      >
        {values.map((v, i) => (
          <div
            role="listitem"
            className="admin-column-item"
            key={i}
            title={`${v.label}: ${v.value}`}
          >
            <span className="admin-column-value">
              {new Intl.NumberFormat(locale).format(v.value)}
            </span>
            <span className="admin-column-track">
              <span
                style={{ height: `${Math.max(4, (100 * v.value) / max)}%` }}
              />
            </span>
            <span className="admin-column-label">{v.label.slice(5)}</span>
          </div>
        ))}
      </div>
    );
  return (
    <div className="admin-bar-list">
      {values.map((v, i) => (
        <div key={i}>
          <div className="admin-bar-label">
            <span>{v.label}</span>
            <strong>{new Intl.NumberFormat(locale).format(v.value)}</strong>
          </div>
          <div className="admin-bar-track">
            <div style={{ width: (100 * v.value) / max + "%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
