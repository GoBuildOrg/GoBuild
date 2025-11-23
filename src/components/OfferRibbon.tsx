import React from 'react';
import './OfferRibbon.css';
import { Gift, Percent, Star, Sparkles, Zap } from 'lucide-react';

const offers = [
  { icon: Gift, title: 'Festival Sale', sub: 'Up to 50% off', badge: 'Limited', from: '#ff7a18', to: '#ffb199' },
  { icon: Percent, title: 'New User', sub: '₹500 OFF', badge: 'New', from: '#00c6ff', to: '#0072ff' },
  { icon: Star, title: 'Top Rated', sub: 'Verified pros', badge: 'Trusted', from: '#7b61ff', to: '#a78bfa' },
  { icon: Sparkles, title: 'Diwali Special', sub: 'Gifts & deals', badge: 'Festival', from: '#ff9068', to: '#ff4d6d' },
  { icon: Zap, title: 'Flash Deal', sub: 'Today only', badge: 'Hurry', from: '#00d2ff', to: '#3a7bd5' },
];

const OfferRibbon: React.FC = () => {
  return (
    <div className="offer-ribbon hero-pattern from-primary/5 to-background py-8" role="region" aria-label="Offers ribbon">
      <div className="offer-track" aria-hidden={false}>
        <div className="offer-group">
          {offers.map((o, i) => {
            const Icon = o.icon;
            return (
              <div className="offer-card" key={i}>
                <div
                  className="icon-box"
                  style={{
                    background: `linear-gradient(135deg, ${o.from}, ${o.to})`,
                    boxShadow: `0 6px 18px ${o.to}33`,
                  }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="offer-text">
                  <div className="offer-title">{o.title}</div>
                  <div className="offer-sub">{o.sub}</div>
                </div>
                <div
                  className="offer-badge"
                  style={{ background: o.from, color: '#fff', borderColor: 'transparent' }}
                >
                  {o.badge}
                </div>
              </div>
            );
          })}
        </div>

        {/* duplicate for seamless loop */}
        <div className="offer-group" aria-hidden="true">
          {offers.map((o, i) => {
            const Icon = o.icon;
            return (
              <div className="offer-card" key={`dup-${i}`}>
                <div
                  className="icon-box"
                  style={{
                    background: `linear-gradient(135deg, ${o.from}, ${o.to})`,
                    boxShadow: `0 6px 18px ${o.to}33`,
                  }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="offer-text">
                  <div className="offer-title">{o.title}</div>
                  <div className="offer-sub">{o.sub}</div>
                </div>
                <div
                  className="offer-badge"
                  style={{ background: o.from, color: '#fff', borderColor: 'transparent' }}
                >
                  {o.badge}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OfferRibbon;
