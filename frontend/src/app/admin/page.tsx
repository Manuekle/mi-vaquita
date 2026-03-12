"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChefHat,
  Package,
  ShoppingBag,
  Clock,
  Loader2,
  Users,
  ChevronRight,
  TrendingUp,
  History,
  Settings
} from "lucide-react";
import { getPedidos, getTurnoActual, avanzarTurno } from "@/lib/api";
import type { Pedido, TurnoData } from "@/types";

export default function AdminDashboard() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [turnoActual, setTurnoActual] = useState<TurnoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [avanzando, setAvanzando] = useState(false);

  const fetchData = async () => {
    try {
      const [pedidosRes, turnoRes] = await Promise.all([
        getPedidos('pendiente'),
        getTurnoActual()
      ]);

      if (pedidosRes.success && pedidosRes.data) {
        setPedidos(pedidosRes.data);
      }
      if (turnoRes.success) {
        setTurnoActual(turnoRes.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh interval for live dashboard
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAvanzarTurno = async () => {
    setAvanzando(true);
    try {
      await avanzarTurno();
      fetchData();
    } catch (error) {
      console.error("Error advancing turno:", error);
    } finally {
      setAvanzando(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-amber-500/10 text-amber-600';
      case 'preparando': return 'bg-primary/10 text-primary';
      case 'listo': return 'bg-green-500/10 text-green-600';
      default: return 'bg-dark/10 text-dark/40';
    }
  };

  return (
    <div className="min-h-screen bg-[#F2ECE1] pt-32 pb-24 px-6 md:px-12">
      <div className="container mx-auto">

        {/* Header Editorial */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-20 gap-12 border-b border-dark/5 pb-16 text-center md:text-left">
          <div className="max-w-2xl w-full">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              <div className="h-px w-12 bg-primary/30" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary/60">Operaciones</span>
            </div>
            <h1 className="text-editorial-lg text-dark uppercase leading-tight md:leading-none">
              PANEL DE <br className="hidden md:block" /> CONTROL
            </h1>
          </div>
          <div className="flex gap-4">
            <Link href="/">
              <Button variant="outline" className="h-14 px-8 rounded-full border-2 border-dark/10 text-dark hover:border-dark hover:bg-dark hover:text-white transition-all font-black text-[10px] uppercase tracking-widest">
                Ver Studio
              </Button>
            </Link>
          </div>
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <Card className="bg-white border-none shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-dark/40">Turno Actual</span>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-primary" strokeWidth={3} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-6xl md:text-7xl font-black text-primary tracking-tighter leading-none">
                {turnoActual?.numero ? `#${turnoActual.numero < 10 ? `0${turnoActual.numero}` : turnoActual.numero}` : "00"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-dark/40">Pendientes</span>
              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-amber-500" strokeWidth={3} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-6xl md:text-7xl font-black text-dark tracking-tighter leading-none">
                {pedidos.length < 10 ? `0${pedidos.length}` : pedidos.length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-dark/40">Ventas Hoy</span>
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-500" strokeWidth={3} />
              </div>
            </CardHeader>
            <CardContent className="h-28 flex flex-col justify-center">
              <div className="text-3xl font-black text-dark tracking-tighter leading-none">
                ${pedidos.reduce((acc, p) => acc + p.total, 0).toLocaleString()}
              </div>
              <span className="text-[8px] font-bold text-dark/30 uppercase tracking-widest mt-2 block">Estimado en cola</span>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Button
              onClick={handleAvanzarTurno}
              disabled={avanzando}
              className="h-full bg-dark text-white hover:bg-primary rounded-[2.5rem] transition-all duration-500 shadow-2xl shadow-dark/20 flex flex-col items-center justify-center gap-4 py-8"
            >
              {avanzando ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <>
                  <ChefHat className="h-10 w-10" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Siguiente Turno</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Navigation Links */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-4 mb-4 px-4">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-dark/30">Gestión</span>
            </div>

            <Link href="/admin/productos" className="block group">
              <div className="bg-white p-8 rounded-[2rem] shadow-soft border border-transparent group-hover:border-primary/20 group-hover:shadow-elevated transition-all duration-500 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="h-14 w-14 rounded-2xl bg-accent/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Package className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-dark uppercase tracking-tight">Productos</span>
                    <span className="text-[9px] font-bold text-dark/30 uppercase tracking-widest">Editar Catálogo</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-dark/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link href="/admin/pedidos" className="block group">
              <div className="bg-white p-8 rounded-[2rem] shadow-soft border border-transparent group-hover:border-primary/20 group-hover:shadow-elevated transition-all duration-500 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="h-14 w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                    <History className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-dark uppercase tracking-tight">Pedidos</span>
                    <span className="text-[9px] font-bold text-dark/30 uppercase tracking-widest">Historial y Estados</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-dark/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <div className="bg-white/40 p-10 rounded-[2.5rem] border border-dark/5 text-center">
              <Settings className="h-6 w-6 text-dark/20 mx-auto mb-4" />
              <p className="text-[9px] font-black uppercase tracking-widest text-dark/30 leading-relaxed">
                Los turnos se reinician <br /> automáticamente cada día <br /> a las 00:00
              </p>
            </div>
          </div>

          {/* Production Column */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-elevated h-full">
              <div className="flex items-center gap-4 mb-10">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-dark/30">Cola de Producción</span>
                <div className="h-px flex-1 bg-dark/5" />
              </div>

              <div className="space-y-6">
                {loading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-dark/20" />
                  </div>
                ) : pedidos.length === 0 ? (
                  <div className="text-center py-24 flex flex-col items-center">
                    <ChefHat className="h-12 w-12 text-dark/5 mb-6" />
                    <p className="text-xs font-black uppercase tracking-widest text-dark/20">
                      Mesa Limpia • Sin pedidos pendientes
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pedidos.slice(0, 8).map((pedido, i) => (
                      <motion.div
                        key={pedido.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group flex flex-col md:flex-row items-center justify-between p-6 rounded-[1.8rem] bg-accent/5 hover:bg-white hover:shadow-lg transition-all duration-500 border border-transparent hover:border-dark/5"
                      >
                        <div className="flex items-center gap-6 mb-4 md:mb-0">
                          <span className="text-3xl font-black tracking-tighter text-dark opacity-20 group-hover:opacity-100 transition-opacity">
                            {pedido.turno ? `#${pedido.turno}` : '--'}
                          </span>
                          <div className="flex flex-col">
                            <span className="text-base font-black tracking-tighter text-dark uppercase">{pedido.nombre_cliente}</span>
                            <span className="text-[9px] font-bold text-dark/30 uppercase tracking-widest">ID: {pedido.id.slice(-6).toUpperCase()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-10 text-right">
                          <div className="hidden md:flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-dark/30 mb-1">Impacto</span>
                            <span className="text-sm font-black text-primary">${pedido.total.toLocaleString()}</span>
                          </div>
                          <div className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${getEstadoColor(pedido.estado)}`}>
                            {pedido.estado}
                          </div>
                          <Link href="/admin/pedidos">
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-dark hover:text-white transition-all">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                    {pedidos.length > 8 && (
                      <Link href="/admin/pedidos" className="block text-center pt-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary hover:tracking-[0.6em] transition-all cursor-pointer">
                          Ver otros {pedidos.length - 8} pedidos
                        </span>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Studio Info info */}
        <div className="mt-24 pt-12 border-t border-dark/5 text-center">
          <span className="text-[9px] font-black uppercase tracking-[0.5em] text-dark/20">Mi Vaquita Admin Dashboard • v2.0</span>
        </div>
      </div>
    </div>
  );
}
