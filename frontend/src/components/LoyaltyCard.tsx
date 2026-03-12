"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Star, Gift, Check, Info, X } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";

export function LoyaltyCard({ onClose }: { onClose?: () => void }) {
  const { stamps, coupons, redeemCoupon } = useUserStore();
  const [showCoupon, setShowCoupon] = useState(false);

  const totalStamps = 10;
  const stampArray = Array.from({ length: totalStamps });

  const couponCode = useMemo(() =>
    `MV-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    []
  );

  const handleRedeem = () => {
    redeemCoupon();
    setShowCoupon(true);
  };

  if (showCoupon) {
    return (
      <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-12 text-dark shadow-2xl min-h-[450px] flex flex-col items-center justify-center text-center">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-accent/10 hover:bg-accent/40 text-dark transition-all z-20"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10"
        >
          <Gift className="h-20 w-20 mx-auto mb-8 text-dark" strokeWidth={1.5} />
          <h3 className="text-4xl font-black tracking-tighter mb-4 uppercase">¡TU REGALO!</h3>
          <p className="text-xs font-bold text-dark/60 uppercase tracking-widest leading-relaxed mb-10 max-w-[240px]">
            Presenta este código en el local para reclamar tu postre gratis.
          </p>

          <div className="bg-dark text-white py-6 px-10 rounded-[2rem] font-mono text-2xl font-black tracking-[0.3em] mb-12 shadow-xl">
            {couponCode}
          </div>

          <Button
            onClick={() => setShowCoupon(false)}
            className="rounded-full bg-dark text-white font-black text-[10px] uppercase tracking-widest px-10 h-14 hover:bg-dark/90"
          >
            Volver a la Tarjeta
          </Button>
        </motion.div>

        {/* Decorations */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 text-4xl mt-10">🧁</div>
          <div className="absolute bottom-20 right-10 text-4xl">✨</div>
          <div className="absolute top-1/2 right-20 text-3xl">🎂</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[3rem] bg-white p-12 text-dark shadow-elevated">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-accent/10 hover:bg-accent/40 text-dark transition-all z-20"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {/* Background patterns */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl opacity-50" />
      <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl opacity-50" />

      <div className="relative z-10">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h3 className="text-4xl font-black tracking-tighter leading-none italic text-dark">TARJETA <br /> FIDELIDAD</h3>
          </div>
          <div className="flex flex-col items-end pr-14">
            <div className="h-14 w-14 rounded-full border border-dark/5 flex items-center justify-center bg-accent/5 shadow-inner">
              <Star className="h-6 w-6 text-primary drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]" fill="currentColor" />
            </div>
          </div>
        </div>

        <p className="mb-8 text-xs font-bold text-dark/40 leading-relaxed max-w-[200px]">
          Colecciona 10 sellos y recibe una creación artesanal de regalo.
        </p>

        {/* Stamps Grid */}
        <div className="grid grid-cols-5 gap-3 mb-10">
          {stampArray.map((_, i) => {
            const isFilled = i < stamps;
            return (
              <div
                key={i}
                className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-500 ${isFilled
                    ? "bg-primary text-white scale-100 shadow-lg shadow-primary/20"
                    : "bg-dark/5 border border-dark/5 text-dark/10 scale-95"
                  }`}
              >
                {isFilled ? <Check className="h-4 w-4 stroke-[4]" /> : <span className="text-[10px] font-black">{i + 1}</span>}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-dark/5">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-dark/20">Disponibles</span>
            <span className="text-lg font-black text-dark">{coupons} {coupons === 1 ? 'Regalo' : 'Regalos'}</span>
          </div>
          {coupons > 0 && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleRedeem}
                className="h-12 px-6 rounded-full bg-dark text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-lg"
              >
                Reclamar Ahora
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
