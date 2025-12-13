import React from "react";
import { Gift, Percent, Star, Sparkles, Zap } from "lucide-react";

const offers = [
  { icon: Gift, title: "Christmas Sale", sub: "Up to 5% off", badge: "Limited", from: "#ff7a18", to: "#ffb199" },
  { icon: Percent, title: "New User", sub: "10% OFF", badge: "New", from: "#00c6ff", to: "#0072ff" },
  { icon: Star, title: "Top Rated Workers", sub: "Verified pros", badge: "Trusted", from: "#7b61ff", to: "#a78bfa" },
  { icon: Sparkles, title: "Christmas Special", sub: "Gifts & deals", badge: "Festival", from: "#ff9068", to: "#ff4d6d" },
  
];

const OfferRibbon: React.FC = () => {
  return (
    <div
      role="region"
      aria-label="Offers ribbon"
      className="w-full overflow-hidden bg-white border-y border-slate-200 py-4"
    >
      {/* Track */}
      <div
        className="
          flex items-center w-max
          animate-[marquee_18s_linear_infinite]
          hover:[animation-play-state:paused]
        "
      >
        <OfferGroup />
        <OfferGroup ariaHidden />
      </div>

      {/* Seamless marquee animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

const OfferGroup = ({ ariaHidden = false }: { ariaHidden?: boolean }) => (
  <div aria-hidden={ariaHidden} className="flex items-center gap-12 pr-12">
    {offers.map((o, i) => {
      const Icon = o.icon;
      return (
        <div
          key={i}
          className="
            inline-flex items-center gap-6
            min-w-[300px]
            px-8 py-4
            rounded-full
            bg-[#f8fbff]
            border border-slate-200
            shadow-lg
            whitespace-nowrap
            transition-all duration-200
            hover:-translate-y-2 hover:scale-105 hover:shadow-2xl
          "
        >
          {/* Icon */}
          <div
            className="w-20 h-20 rounded-xl flex items-center justify-center border border-slate-200"
            style={{
              background: `linear-gradient(135deg, ${o.from}, ${o.to})`,
              boxShadow: `0 6px 18px ${o.to}33`,
            }}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>

          {/* Text */}
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold leading-none text-[#05295f]">
              {o.title}
            </span>
            <span className="text-base text-[#0b4bd6]">
              {o.sub}
            </span>
          </div>

          {/* Badge */}
          <span
            className="ml-2 px-4 py-1 rounded-full text-sm font-extrabold text-white"
            style={{ background: o.from }}
          >
            {o.badge}
          </span>
        </div>
      );
    })}
  </div>
);

export default OfferRibbon;
