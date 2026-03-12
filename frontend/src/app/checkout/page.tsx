"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, ArrowLeft, ArrowRight, ShoppingBag, User, Phone, CheckCircle } from "lucide-react";
import { Wallet, IdentificationBadge } from "@phosphor-icons/react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/store/cartStore";
import { createPedido } from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import { CartItem } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const { items, clearCart, getTotal } = useCartStore();
  const total = getTotal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    nombre_cliente: "",
    telefono: "",
    sede: "lacteos_colombia" as "lacteos_colombia" | "campanario",
    tipo_entrega: "recoger" as "recoger" | "domicilio",
    direccion: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (formData.nombre_cliente.length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      return;
    }
    
    if (!/^\d{10}$/.test(formData.telefono)) {
      setError("El teléfono debe tener 10 dígitos");
      return;
    }

    if (formData.tipo_entrega === "domicilio" && formData.direccion.length < 5) {
      setError("Por favor ingresa una dirección de entrega válida");
      return;
    }

    setLoading(true);

    try {
      const pedidoData = {
        nombre_cliente: formData.nombre_cliente,
        telefono: formData.telefono,
        sede: formData.sede,
        tipo_entrega: formData.tipo_entrega,
        direccion: formData.tipo_entrega === "domicilio" ? formData.direccion : undefined,
        items: items.map((item: CartItem) => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad
        }))
      };

      const response = await createPedido(pedidoData);
      
      if (response.success && response.data) {
        // Fidelity logic
        useUserStore.getState().addStamp();
        useUserStore.getState().addActiveOrder(response.data.id);
        useUserStore.getState().addNotification({
          orderId: response.data.id,
          title: '¡Reserva Confirmada!',
          message: `Tu pedido #${response.data.turno || ''} ha sido recibido. Te avisaremos cuando esté listo.`,
          type: 'order_status'
        });
        if (user) {
          useUserStore.getState().setHasPurchase(true);
        }

        clearCart();
        router.push(`/pedido/${response.data.id}`);
      } else {
        setError(response.error || "Error al crear el pedido");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F2ECE1] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-editorial-md text-dark mb-8 uppercase">Bolso Vacío</h2>
          <Link href="/menu">
            <button className="px-12 py-5 bg-dark text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-primary transition-all">
              Explorar Colección
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2ECE1] pt-32 pb-24 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          
          {/* Left: Branding & Summary */}
          <div className="space-y-12">
            <Link href="/menu" className="group inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-dark/40 hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" strokeWidth={3} />
              Volver a Colección
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">Finalizar</span>
              <h1 className="text- editorial-lg text-dark mb-12 uppercase leading-[0.9]">
                TU <br /> SELECCIÓN
              </h1>

              <div className="space-y-8 pr-12">
                {items.map((item: CartItem) => (
                  <div key={item.producto_id} className="flex justify-between items-end border-b border-dark/5 pb-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-tighter text-dark">{item.nombre}</span>
                      <span className="text-[10px] font-bold text-dark/40 uppercase">Cantidad: {item.cantidad}</span>
                    </div>
                    <span className="text-sm font-black text-dark tracking-tighter">${(item.precio * item.cantidad).toLocaleString()}</span>
                  </div>
                ))}
                
                <div className="pt-8 flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-dark/30">Total Estimado</span>
                  <span className="text-4xl font-black tracking-tighter text-dark">${total.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Modern Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-dark/5 border border-white/20"
          >
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label htmlFor="nombre" className="text-[10px] font-black uppercase tracking-[0.3em] text-dark/40 ml-1">
                    Nombre Completo
                  </Label>
                  <Input
                    id="nombre"
                    placeholder="LUIS ALBERTO"
                    value={formData.nombre_cliente}
                    onChange={(e) => setFormData({ ...formData, nombre_cliente: e.target.value.toUpperCase() })}
                    className="h-16 px-6 rounded-2xl bg-accent/5 border-transparent text-base font-black tracking-widest uppercase focus:bg-white focus:border-primary/20 transition-all font-mono-not-really-just-sans"
                    required
                  />
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="telefono" className="text-[10px] font-black uppercase tracking-[0.3em] text-dark/40 ml-1">
                    Teléfono Móvil
                  </Label>
                  <Input
                    id="telefono"
                    placeholder="300 000 0000"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    className="h-16 px-6 rounded-2xl bg-accent/5 border-transparent text-base font-black tracking-widest focus:bg-white focus:border-primary/20 transition-all"
                    maxLength={10}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-dark/40 ml-1">
                    Punto de Recogida / Sede
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: "lacteos_colombia", label: "Lácteos Colombia" },
                      { id: "campanario", label: "Campanario" }
                    ].map((sede) => (
                      <button
                        key={sede.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, sede: sede.id as any })}
                        className={`h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                          formData.sede === sede.id 
                            ? "bg-dark text-white border-dark" 
                            : "bg-accent/5 text-dark/40 border-transparent hover:border-dark/10"
                        }`}
                      >
                        {sede.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-dark/40 ml-1">
                    Método de Entrega
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: "recoger", label: "Recoger en Tienda" },
                      { id: "domicilio", label: "Domicilio" }
                    ].map((tipo) => (
                      <button
                        key={tipo.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, tipo_entrega: tipo.id as any })}
                        className={`h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                          formData.tipo_entrega === tipo.id 
                            ? "bg-dark text-white border-dark" 
                            : "bg-accent/5 text-dark/40 border-transparent hover:border-dark/10"
                        }`}
                      >
                        {tipo.label}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {formData.tipo_entrega === "domicilio" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <Label htmlFor="direccion" className="text-[10px] font-black uppercase tracking-[0.3em] text-dark/40 ml-1">
                        Dirección de Entrega
                      </Label>
                      <Input
                        id="direccion"
                        placeholder="CALLE, CARRERA, BARRIO, APTO"
                        value={formData.direccion}
                        onChange={(e) => setFormData({ ...formData, direccion: e.target.value.toUpperCase() })}
                        className="h-16 px-6 rounded-2xl bg-accent/5 border-transparent text-base font-black tracking-widest uppercase focus:bg-white focus:border-primary/20 transition-all"
                        required={formData.tipo_entrega === "domicilio"}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 rounded-2xl bg-destructive/5 text-destructive text-[10px] font-black uppercase tracking-widest text-center"
                >
                  {error}
                </motion.div>
              )}

              <div className="p-6 rounded-3xl bg-[#F2ECE1]/50 border border-dark/5 flex items-center gap-6">
                 <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Wallet className="h-5 w-5 text-dark" strokeWidth={2.5} />
                 </div>
                 <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-dark block mb-1">Pago Presencial</span>
                    <p className="text-[9px] font-bold text-dark/40 uppercase tracking-widest">Liquidación al recoger pedido</p>
                 </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-dark text-white rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-primary transition-all duration-500 shadow-xl shadow-dark/20 flex items-center justify-center gap-4 group disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Confirmar Reserva
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" strokeWidth={3} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        
        </div>
      </div>
    </div>
  );
}
