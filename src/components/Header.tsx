'use client';

import { Stats } from '@/src/types';
import LogoCss from './LogoCss';

interface HeaderProps {
  stats: Stats;
  onNotificationClick: () => void;
}

export default function Header({ stats, onNotificationClick }: HeaderProps) {
  return (
    <div className="header">
      <div className="header-top">
        <LogoCss />
        <button className="notification-btn" onClick={onNotificationClick}>
          🔔
        </button>
      </div>
      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-value">{stats.accuracy}%</div>
          <div className="stat-label">Acertos</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.todayCount}</div>
          <div className="stat-label">Hoje</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">+{stats.roi}%</div>
          <div className="stat-label">ROI</div>
        </div>
      </div>
    </div>
  );
}
