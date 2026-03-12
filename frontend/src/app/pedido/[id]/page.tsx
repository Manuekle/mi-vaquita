"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, ArrowLeft, House, Clock, CheckCircle, Share2 } from "lucide-react";
import { getPedidoById } from "@/lib/api";
import type { Pedido } from "@/types";

export default function PedidoPage() {
  const params = useParams();
  const router = useRouter();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    if (id) {
      cargarPedido(id);
    }
  }, [params.id]);

  const cargarPedido = async (id: string) => {
    setLoading(true);
    const result = await getPedidoById(id);
    if (result.success && result.data) {
      setPedido(result.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2ECE1] flex items-center justify-center">
        <motion.div
           animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
           transition={{ duration: 1.5, repeat: Infinity }}
           className="text-[10px] font-black uppercase tracking-[0.5em] text-dark/20"
        >
          Confirmando Reserva...
        </motion.div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="min-h-screen bg-[#F2ECE1] flex items-center justify-center p-6">
          <div className="text-center">
            <h2 className="text-editorial-md text-dark mb-8 uppercase">Reserva No Encontrada</h2>
            <Link href="/menu">
               <button className="px-10 py-4 bg-dark text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all">
                  Volver a Colección
               </button>
            </Link>
          </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2ECE1] pt-32 pb-24 px-6 md:px-12">
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          
          {/* Left: Summary & Success */}
          <div className="space-y-12">
            <Link href="/menu" className="group inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-dark/40 hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" strokeWidth={3} />
              Volver a la Tienda
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                 <CheckCircle className="h-5 w-5 text-green-600" strokeWidth={3} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-green-600 mb-4 block">Éxito • Confirmado</span>
              <h1 className="text-editorial-lg text-dark mb-12 uppercase leading-[0.9]">
                RESERVA <br /> REGISTRADA
              </h1>

              <div className="space-y-8 pr-12">
                <div className="flex flex-col gap-2">
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-dark/30">Cliente</span>
                   <span className="text-xl font-black tracking-tighter text-dark uppercase">{pedido.nombre_cliente}</span>
                </div>
                
                <div className="flex flex-col gap-4 border-t border-dark/10 pt-8 mt-8">
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-dark/30">Artículos</span>
                   <div className="space-y-4">
                      {pedido.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center group cursor-default">
                           <span className="text-xs font-black uppercase tracking-tighter text-dark/60 group-hover:text-dark transition-colors">{item.cantidad}× {item.nombre}</span>
                           <span className="text-xs font-black tracking-tighter text-dark/40">${(item.precio * item.cantidad).toLocaleString()}</span>
                        </div>
                      ))}
                   </div>
                </div>
                
                <div className="pt-8 border-t-2 border-dark flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-dark/30">Total</span>
                  <span className="text-4xl font-black tracking-tighter text-dark">${pedido.total.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Turn Card - Massive Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="bg-white rounded-[4rem] p-12 md:p-16 shadow-2xl shadow-dark/5 border border-white/20 text-center flex flex-col items-center">
              <div className="h-12 w-12 rounded-full border border-dark/5 flex items-center justify-center mb-8">
                <Clock className="h-4 w-4 text-primary" strokeWidth={3} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-dark/30 mb-2">POSICIÓN EN COLA</span>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="text-[10rem] md:text-[14rem] font-black text-dark leading-none tracking-tighter mb-8"
              >
                #{pedido.turno}
              </motion.div>
              
              <div className="w-full h-px bg-dark/5 mb-12" />

              <div className="flex flex-col gap-4 w-full">
                {pedido.whatsapp_url && (
                  <motion.a
                    href={pedido.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-4 bg-green-500 text-white h-16 rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-green-500/20"
                  >
                    <MessageCircle className="h-4 w-4" strokeWidth={3} />
                    Enviar a WhatsApp
                  </motion.a>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/turnos" className="flex-1">
                    <button className="w-full h-14 rounded-full border-2 border-dark/10 text-dark font-black text-[10px] uppercase tracking-widest hover:bg-dark hover:text-white transition-all">
                       Monitor
                    </button>
                  </Link>
                  <Link href="/menu" className="flex-1">
                    <button className="w-full h-14 rounded-full border-2 border-dark/10 text-dark font-black text-[10px] uppercase tracking-widest hover:bg-dark hover:text-white transition-all">
                       Regresar
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Background Decorative */}
            <div className="absolute -z-10 -bottom-8 -right-8 w-40 h-40 rounded-full bg-primary/5 blur-3xl opacity-50" />
          </motion.div>
        
        </div>
      </div>
    </div>
  );
}
