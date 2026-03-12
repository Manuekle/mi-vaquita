"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Clock, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getTurnoActual } from "@/lib/api";
import type { TurnoData } from "@/types";

export default function TurnosPage() {
  const [turnoActual, setTurnoActual] = useState<TurnoData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTurnos = async () => {
    try {
      const response = await getTurnoActual();
      if (response.success) {
        setTurnoActual(response.data);
      }
    } catch (error) {
      console.error("Error fetching turnos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurnos();
    const interval = setInterval(fetchTurnos, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F2ECE1] pt-32 pb-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <Link href="/menu" className="group inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-dark/40 hover:text-primary transition-colors mb-12">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" strokeWidth={3} />
          Volver a Colección
        </Link>

        {/* Abstract Branding */}
        <div className="text-center mb-24 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ 
              rotate: { duration: 60, repeat: Infinity, ease: "linear" },
              scale: { type: "spring", stiffness: 100, damping: 20 }
            }}
            className="w-32 md:w-40 flex items-center justify-center mb-10 group overflow-hidden bg-transparent"
          >
            <Image 
              src="/logo.png" 
              alt="Mi Vaquita" 
              width={160} 
              height={160} 
              className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-110" 
              priority
            />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black uppercase tracking-[0.6em] text-dark/30 mb-4"
          >
            Estado de Atención
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-editorial-lg text-dark leading-none uppercase"
          >
            COLA <br /> VITAL
          </motion.h2>
        </div>

        {/* Display Numerical Turno */}
        <div className="relative flex justify-center">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6 py-20"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="h-16 w-16 rounded-full border-2 border-dark/5 border-t-primary"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-dark/20">Consultando...</span>
              </motion.div>
            ) : turnoActual?.numero ? (
              <motion.div
                key="turno"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative bg-white rounded-[4rem] p-16 md:p-24 shadow-2xl shadow-dark/5 w-full flex flex-col items-center"
              >
                <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                   <Clock className="h-4 w-4 text-primary" strokeWidth={3} />
                   <span className="text-[9px] font-black uppercase tracking-widest text-dark/40">Llamando</span>
                </div>
                
                <motion.div
                  key={turnoActual.numero}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="text-[10rem] md:text-[18rem] font-black text-dark leading-none tracking-tighter"
                >
                  {turnoActual.numero < 10 ? `0${turnoActual.numero}` : turnoActual.numero}
                </motion.div>
                
                <div className="mt-12 flex flex-col items-center gap-8">
                   {turnoActual.posicion_encola && (
                     <div className="px-6 py-3 rounded-full bg-accent/20 border border-dark/5 flex items-center gap-4">
                        <Users className="h-4 w-4 text-dark" strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-dark">
                          {turnoActual.posicion_encola - 1} en espera
                        </span>
                     </div>
                   )}
                   <p className="text-[9px] font-black uppercase tracking-[0.4em] text-dark/20">Presente en el mostrador</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <p className="text-xl font-bold text-dark/30 uppercase tracking-widest mb-10">Sin Cola Activa</p>
                <Link href="/menu">
                   <button className="px-10 py-4 bg-dark text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all">
                      Iniciar Pedido
                   </button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Decorative Back Circles */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square border border-dark/5 rounded-full" 
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] aspect-square border border-dark/5 rounded-full opacity-50" 
          />
        </div>

        <div className="text-center mt-24">
           <span className="text-[9px] font-black uppercase tracking-widest text-dark/20">Sincronización Automática • Cada 10s</span>
        </div>
      </div>
    </div>
  );
}
