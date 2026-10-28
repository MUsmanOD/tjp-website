"use client";
import {
  Users,
  Clock3,
  UserCheck,
  UserX,
  Archive,
  Globe2,
  BarChart3,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { Bars } from "./bars";
const cards = [
  ["pending", Clock3],
  ["approved", UserCheck],
  ["rejected", UserX],
  ["archived", Archive],
];
export function Overview({ stats }) {
  const { messages, locale } = useLanguage(),
    t = messages.portal,
    ui = t.dashboardUi;
  const count = (status) =>
    stats.statuses.find((x) => x._id === status)?.count || 0;
  const total = stats.statuses.reduce((sum, item) => sum + item.count, 0);
  const views = stats.traffic.reduce((sum, item) => sum + item.views, 0);
  const sessions = stats.traffic.reduce((sum, item) => sum + item.sessions, 0);
  return (
    <div className="admin-overview space-y-6">
      <div className="admin-metric-grid">
        <Card className="admin-metric">
          <div className="admin-metric-top">
            <span>{ui.totalApplications}</span>
            <span className="admin-metric-icon">
              <Users aria-hidden="true" />
            </span>
          </div>
          <strong>{new Intl.NumberFormat(locale).format(total)}</strong>
        </Card>
        {cards.map(([key, Icon]) => (
          <Card className="admin-metric" key={key}>
            <div className="admin-metric-top">
              <span>{t[key]}</span>
              <span className="admin-metric-icon">
                <Icon aria-hidden="true" />
              </span>
            </div>
            <strong>{new Intl.NumberFormat(locale).format(count(key))}</strong>
          </Card>
        ))}
      </div>
      <div className="admin-insight-grid">
        <Card className="admin-chart-card">
          <CardHeader className="admin-card-header">
            <div>
              <CardTitle as="h2" className="admin-card-title">
                {t.applicationsTrend}
              </CardTitle>
            </div>
            <span className="admin-card-icon">
              <BarChart3 />
            </span>
          </CardHeader>
          <CardContent className="admin-card-content">
            <Bars
              values={stats.trend.map((x) => ({
                label: x._id,
                value: x.count,
              }))}
              variant="chart"
            />
          </CardContent>
        </Card>
        <Card className="admin-chart-card">
          <CardHeader className="admin-card-header">
            <div>
              <CardTitle as="h2" className="admin-card-title">
                {t.regions}
              </CardTitle>
            </div>
            <span className="admin-card-icon">
              <MapPin />
            </span>
          </CardHeader>
          <CardContent className="admin-card-content">
            <Bars
              values={stats.regions.map((x) => ({
                label: t.regionNames[x._id] || x._id,
                value: x.count,
              }))}
            />
          </CardContent>
        </Card>
      </div>
      <div className="admin-traffic-heading">
        <div>
          <h2>{ui.visitorActivity}</h2>
        </div>
        <span className="admin-period">{ui.last30}</span>
      </div>
      <div className="admin-traffic-grid">
        <Card className="admin-traffic-card">
          <div className="admin-traffic-top">
            <div>
              <span>{t.views}</span>
              <strong>{new Intl.NumberFormat(locale).format(views)}</strong>
            </div>
            <span className="admin-card-icon">
              <Globe2 />
            </span>
          </div>
          <Bars
            values={stats.traffic.map((x) => ({
              label: x.day + " · " + x.path,
              value: x.views,
            }))}
          />
        </Card>
        <Card className="admin-traffic-card">
          <div className="admin-traffic-top">
            <div>
              <span>{t.sessionsEstimate}</span>
              <strong>{new Intl.NumberFormat(locale).format(sessions)}</strong>
            </div>
            <span className="admin-card-icon">
              <Users />
            </span>
          </div>
          <Bars
            values={stats.traffic.map((x) => ({
              label: x.day + " · " + x.path,
              value: x.sessions,
            }))}
          />
        </Card>
      </div>
      <div className="admin-overseas">
        <Globe2 aria-hidden="true" />
        <span>{t.overseas}</span>
        <strong>{new Intl.NumberFormat(locale).format(stats.overseas)}</strong>
      </div>
    </div>
  );
}
