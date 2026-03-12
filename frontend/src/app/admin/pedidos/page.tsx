"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  ChevronLeft,
  Loader2,
  ExternalLink,
  Calendar,
  Phone,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getPedidos, updatePedidoEstado } from "@/lib/api";
import { Pedido } from "@/types";

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const res = await getPedidos();
      if (res.success && res.data) {
        setPedidos(res.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const handleUpdateEstado = async (id: string, nuevoEstado: string) => {
    try {
      await updatePedidoEstado(id, nuevoEstado);
      fetchPedidos();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getNextStatus = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'preparando';
      case 'preparando': return 'listo';
      case 'listo': return 'completado';
      default: return null;
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'pendiente': return <Clock className="h-3 w-3" />;
      case 'preparando': return <Truck className="h-3 w-3 animate-pulse" />;
      case 'listo': return <CheckCircle2 className="h-3 w-3" />;
      case 'completado': return <CheckCircle2 className="h-3 w-3" />;
      case 'cancelado': return <XCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-amber-500/10 text-amber-600';
      case 'preparando': return 'bg-primary/10 text-primary';
      case 'listo': return 'bg-green-500/10 text-green-600';
      case 'completado': return 'bg-dark/10 text-dark/40';
      case 'cancelado': return 'bg-red-500/10 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredPedidos = pedidos.filter(p => {
    const matchesSearch = p.nombre_cliente.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filtroEstado === "todos" || p.estado === filtroEstado;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#F2ECE1] pt-32 pb-24 px-6 md:px-12">
      <div className="container mx-auto">

        {/* Header Section - Editorial Style */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-20 gap-12 border-b border-dark/5 pb-16 text-center md:text-left">
          <div className="max-w-2xl w-full">
            <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary mb-6 hover:translate-x-[-4px] transition-transform">
              <ChevronLeft className="h-3 w-3" />
              Volver al Panel
            </Link>
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              <div className="h-px w-12 bg-primary/30" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary/60">Registros</span>
            </div>
            <h1 className="text-editorial-lg text-dark uppercase leading-tight md:leading-none">
              GESTIÓN DE <br className="hidden md:block" /> PEDIDOS
            </h1>
          </div>

          {/* Subtle Tab Filter */}
          <div className="flex flex-wrap items-center justify-center gap-6 border-b border-dark/5 md:border-none pb-4 md:pb-0">
            {['todos', 'pendiente', 'preparando', 'listo', 'completado'].map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`relative py-2 text-[10px] font-black uppercase tracking-widest transition-all ${filtroEstado === estado ? 'text-primary' : 'text-dark/30 hover:text-dark'}`}
              >
                {estado}
                {filtroEstado === estado && (
                  <motion.div layoutId="filter-active" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filters & Search - Minimal */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-dark/30" />
            <Input
              placeholder="BUSCAR CLIENTE O ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-20 pl-16 pr-8 rounded-[1.5rem] border-none bg-white/60 focus:bg-white shadow-soft font-bold text-xs uppercase tracking-[0.2em] focus-visible:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-10">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-dark/20" />
            </div>
          ) : filteredPedidos.length === 0 ? (
            <div className="text-center py-32 rounded-[3rem] border-2 border-dashed border-dark/5 bg-white/20">
              <p className="text-xs font-black uppercase tracking-[0.4em] text-dark/20">No hay pedidos registrados</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {filteredPedidos.map((pedido, idx) => {
                const nextStatus = getNextStatus(pedido.estado);
                return (
                  <motion.div
                    key={pedido.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="group relative overflow-hidden border-none shadow-soft hover:shadow-elevated transition-all duration-700 bg-white rounded-[2.5rem]">
                      {/* Artistic Background Turn Number */}
                      <span className="absolute -right-8 -top-12 text-[12rem] font-bold text-dark/5 select-none leading-none tracking-tighter group-hover:text-primary/5 transition-colors duration-700">
                        {pedido.turno || '--'}
                      </span>

                      <div className="p-10 md:p-12 relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">

                          {/* Left: Info Principal */}
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-6">
                              <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">#{pedido.id.slice(-6).toUpperCase()}</span>
                              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${getStatusColor(pedido.estado)}`}>
                                {getStatusIcon(pedido.estado)}
                                {pedido.estado}
                              </div>
                            </div>

                            <h3 className="text-3xl font-black text-dark uppercase tracking-tighter mb-8 leading-none">
                              {pedido.nombre_cliente}
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-[10px] font-bold text-dark/40 uppercase tracking-widest">
                              <div className="flex flex-col gap-2">
                                <span className="text-[8px] opacity-50 tracking-[0.3em]">Contacto</span>
                                <span className="flex items-center gap-2 text-dark/60"><Phone className="h-3 w-3" /> {pedido.telefono}</span>
                              </div>
                              <div className="flex flex-col gap-2">
                                <span className="text-[8px] opacity-50 tracking-[0.3em]">Fecha</span>
                                <span className="flex items-center gap-2 text-dark/60"><Calendar className="h-3 w-3" /> {new Date(pedido.created_at).toLocaleDateString()}</span>
                              </div>
                              <div className="flex flex-col gap-2">
                                <span className="text-[8px] opacity-50 tracking-[0.3em]">Total Pago</span>
                                <span className="text-xl font-black text-primary transition-all group-hover:scale-105 origin-left">${pedido.total.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Acciones Dinámicas */}
                          <div className="flex flex-col sm:flex-row items-center gap-4 border-t lg:border-t-0 pt-8 lg:pt-0">
                            {nextStatus && (
                              <Button
                                onClick={() => handleUpdateEstado(pedido.id, nextStatus)}
                                className="w-full sm:w-auto h-16 px-10 rounded-full bg-dark text-white hover:bg-primary transition-all duration-500 font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-dark/10 flex items-center gap-3"
                              >
                                <ChevronRight className="h-4 w-4" />
                                Avanzar a {nextStatus}
                              </Button>
                            )}

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              {pedido.whatsapp_url && (
                                <Link href={pedido.whatsapp_url} target="_blank" className="flex-1 sm:flex-none">
                                  <Button variant="outline" className="w-full h-16 px-8 rounded-full border-2 border-dark/10 hover:border-green-500 hover:bg-green-500 hover:text-white transition-all duration-500 font-black text-[10px] uppercase tracking-widest">
                                    WhatsApp
                                  </Button>
                                </Link>
                              )}

                              {/* Subtle Cancel Action */}
                              {pedido.estado !== 'cancelado' && (
                                <button
                                  onClick={() => handleUpdateEstado(pedido.id, 'cancelado')}
                                  className="h-16 px-6 rounded-full text-[9px] font-black uppercase tracking-widest text-dark/20 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
                                >
                                  Cancelar Pedido
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
