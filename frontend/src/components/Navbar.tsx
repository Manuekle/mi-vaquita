"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, X, Minus, Plus, Trash2, Bell, User, Star } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useUserStore, LocalNotification } from "@/store/userStore";
import { LoyaltyCard } from "@/components/LoyaltyCard";
import { AuthModal } from "@/components/AuthModal";

export function Navbar() {
  const { items, removeItem, updateCantidad } = useCartStore();
  const { notifications, markAsRead, user, stamps, activeOrderIds, addNotification, removeActiveOrder } = useUserStore();
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loyaltyOpen, setLoyaltyOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // Order status polling effect
  useEffect(() => {
    if (activeOrderIds.length === 0 || isAdmin) return;

    let isMounted = true;

    const pollOrders = async () => {
      const { getPedidoById } = await import("@/lib/api");
      
      for (const orderId of activeOrderIds) {
        if (!isMounted) break;
        try {
          const response = await getPedidoById(orderId);
          
          if (response.success && response.data) {
            const currentStatus = response.data.estado;
            
            if (['listo', 'entregado', 'cancelado'].includes(currentStatus)) {
              const statusMap: Record<string, string> = {
                listo: '¡Tu pedido está listo!',
                entregado: '¡Pedido entregado! Disfrútalo.',
                cancelado: 'Tu pedido ha sido cancelado.'
              };

              addNotification({
                orderId: orderId,
                title: statusMap[currentStatus] || 'Actualización de Pedido',
                message: `El estado de tu pedido #${response.data.turno || ''} ha cambiado a ${currentStatus}.`,
                type: 'order_status'
              });
              
              removeActiveOrder(orderId);
            }
          }
        } catch (error) {
          console.error("Error polling order status:", error);
        }
      }
    };

    const interval = setInterval(pollOrders, 30000); 
    pollOrders(); 

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeOrderIds, isAdmin, addNotification, removeActiveOrder]);

  const unreadCount = notifications.filter(n => n.status === 'unread').length;
  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when cart is open
  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen]);

  return (
    <>
      {/* ─── Nav Bar ─── */}
      <motion.nav
        initial={false}
        animate={{
          paddingTop: scrolled ? "8px" : "16px",
          paddingBottom: scrolled ? "8px" : "16px",
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed top-0 z-50 w-full transition-colors duration-500 ${scrolled ? "bg-white/80 backdrop-blur-xl shadow-sm shadow-dark/5" : "bg-transparent"
          }`}
      >
        <div className="container mx-auto flex items-center justify-between px-6">
          <Link href="/" className="group flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-24 md:w-32 flex items-center justify-center p-1"
            >
              <Image
                src="/slogan.png"
                alt="Mi Vaquita Slogan"
                width={120}
                height={40}
                className="w-full h-auto drop-shadow-sm origin-left"
                priority
              />
            </motion.div>
          </Link>

          {/* Links + Cart */}
          <div className="flex items-center gap-6">
            {!isAdmin ? (
              <>
                <Link href="/menu" className="hidden md:block text-[10px] font-black uppercase tracking-widest text-dark/60 hover:text-dark transition-colors">
                  Colección
                </Link>
                <Link href="/turnos" className="hidden md:block text-[10px] font-black uppercase tracking-widest text-dark/60 hover:text-dark transition-colors">
                  Esperas
                </Link>

                {/* Club / Loyalty Button */}
                <button
                  onClick={() => setLoyaltyOpen(true)}
                  className="group relative flex items-center gap-2"
                >
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    className="relative p-2.5 rounded-full bg-accent/10 text-dark group-hover:bg-dark group-hover:text-white transition-colors duration-300"
                  >
                    <Star className="h-4 w-4" strokeWidth={2.5} />
                    {stamps > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary ring-2 ring-background" />
                    )}
                  </motion.div>
                  <span className="hidden xl:block text-[10px] font-black uppercase tracking-widest text-dark/60 group-hover:text-dark transition-colors">
                    Club
                  </span>
                </button>

                {/* Login / Profile Button */}
                <button
                  onClick={() => setAuthOpen(true)}
                  className="group relative flex items-center gap-2"
                >
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    className="relative p-2.5 rounded-full bg-accent/10 text-dark group-hover:bg-dark group-hover:text-white transition-colors duration-300"
                  >
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt="Profile" className="h-4 w-4 rounded-full" />
                    ) : (
                      <User className="h-4 w-4" strokeWidth={2.5} />
                    )}
                  </motion.div>
                  <span className="hidden xl:block text-[10px] font-black uppercase tracking-widest text-dark/60 group-hover:text-dark transition-colors">
                    {user ? 'Mi Cuenta' : 'Entrar'}
                  </span>
                </button>

                {/* Notifications Button */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="group relative flex items-center gap-2"
                  >
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      className="relative p-2.5 rounded-full bg-accent/10 text-dark group-hover:bg-dark group-hover:text-white transition-colors duration-300"
                    >
                      <Bell className="h-4 w-4" strokeWidth={2.5} />
                      <AnimatePresence>
                        {unreadCount > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white ring-2 ring-background shadow-sm"
                          >
                            {unreadCount}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </button>

                  {/* Notifications Dropdown */}
                  <AnimatePresence>
                    {notificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-dark/5 overflow-hidden z-[100]"
                      >
                        <div className="p-6 border-b border-dark/5 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-dark">Notificaciones</span>
                          <button onClick={() => setNotificationsOpen(false)}>
                            <X className="h-4 w-4 text-dark/20 hover:text-dark transition-colors" />
                          </button>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-12 text-center">
                              <Bell className="h-8 w-8 text-dark/5 mx-auto mb-4" />
                              <p className="text-[9px] font-black uppercase tracking-widest text-dark/20">Sin notificaciones</p>
                            </div>
                          ) : (
                            notifications.map((n) => (
                              <div 
                                key={n.id} 
                                className={`p-6 border-b border-dark/5 last:border-0 hover:bg-accent/5 transition-colors cursor-pointer ${n.status === 'unread' ? 'bg-primary/5' : ''}`}
                                onClick={() => { markAsRead(n.id); if(n.orderId !== 'loyalty') window.location.href = `/pedido/${n.orderId}`; }}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">{n.title}</span>
                                  <span className="text-[8px] font-bold text-dark/20">{new Date(n.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-xs font-bold text-dark/60 leading-relaxed">{n.message}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Cart button */}
                <button
                  onClick={() => setCartOpen(true)}
                  className="group relative flex items-center gap-2"
                  aria-label="Abrir carrito"
                >
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    className="relative p-2.5 rounded-full bg-dark text-white group-hover:bg-primary transition-colors duration-300"
                  >
                    <ShoppingBag className="h-4 w-4" strokeWidth={2.5} />
                    <AnimatePresence>
                      {totalItems > 0 && (
                        <motion.span
                          key="badge"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white ring-2 ring-background shadow-sm"
                        >
                          {totalItems > 9 ? "9+" : totalItems}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-dark/60 group-hover:text-dark transition-colors">
                    Bolso
                  </span>
                </button>
              </>
            ) : (
              <Link href="/" className="group flex items-center gap-2">
                 <div className="h-10 w-10 rounded-full bg-dark/5 flex items-center justify-center text-dark/40 group-hover:bg-dark group-hover:text-white transition-all">
                    <X className="h-4 w-4" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-dark/40 group-hover:text-dark transition-colors">
                    Salir Admin
                 </span>
              </Link>
            )}
          </div>
        </div>
      </motion.nav>

      {/* ─── Cart Drawer ─── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-[60] bg-dark/40 backdrop-blur-md"
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className="fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-white flex flex-col shadow-2xl shadow-dark/20"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-10 pt-10 pb-8 border-b border-dark/5">
                <h2 className="text-3xl font-black tracking-tighter uppercase text-dark">Tu Selección</h2>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCartOpen(false)}
                  className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-dark hover:bg-dark hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" strokeWidth={2.5} />
                </motion.button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-10 py-6 space-y-6">
                <AnimatePresence initial={false}>
                  {items.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full gap-8 py-20 text-center"
                    >
                      <ShoppingBag className="h-12 w-12 text-dark/10" strokeWidth={1.5} />
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-dark/30">
                        El bolso está vacío
                      </p>
                      <Link href="/menu" onClick={() => setCartOpen(false)}>
                        <button className="px-8 py-3 border-2 border-dark text-dark font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-dark hover:text-white transition-all">
                          Ver Colección
                        </button>
                      </Link>
                    </motion.div>
                  ) : (
                    items.map((item, index) => (
                      <motion.div
                        key={`cart-item-${item.producto_id}`}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="flex gap-5 items-start overflow-hidden"
                      >
                        {/* Thumbnail */}
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden bg-accent/5 rounded-xl">
                          {item.imagen ? (
                            <Image src={item.imagen} alt={item.nombre} fill className="object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <ShoppingBag className="h-6 w-6 text-primary/10" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-black text-sm text-dark leading-tight uppercase tracking-tighter truncate">
                              {item.nombre}
                            </h4>
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.8 }}
                              onClick={() => removeItem(item.producto_id)}
                              className="flex-shrink-0 text-dark/20 hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </motion.button>
                          </div>

                          <p className="text-primary font-black text-xs tracking-wider mb-3">
                            ${item.precio.toLocaleString()}
                          </p>

                          <div className="flex items-center gap-3 bg-accent/5 rounded-full px-2 py-1 w-fit">
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              onClick={() => updateCantidad(item.producto_id, item.cantidad - 1)}
                              className="h-6 w-6 rounded-full flex items-center justify-center text-dark/50 hover:text-dark hover:bg-white transition-all"
                            >
                              <Minus className="h-3 w-3" strokeWidth={3} />
                            </motion.button>
                            <AnimatePresence mode="wait">
                              <motion.span
                                key={item.cantidad}
                                initial={{ y: -8, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 8, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="w-6 text-center font-black text-sm text-dark inline-block select-none"
                              >
                                {item.cantidad}
                              </motion.span>
                            </AnimatePresence>
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              onClick={() => updateCantidad(item.producto_id, item.cantidad + 1)}
                              className="h-6 w-6 rounded-full flex items-center justify-center text-dark/50 hover:text-dark hover:bg-white transition-all"
                            >
                              <Plus className="h-3 w-3" strokeWidth={3} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Footer / Checkout */}
              <AnimatePresence>
                {items.length > 0 && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    className="px-10 pb-10 pt-6 border-t border-dark/5 space-y-6"
                  >
                    <div className="flex items-end justify-between">
                      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-dark/30">Total</span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={total}
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 10, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-3xl font-black tracking-tighter text-dark"
                        >
                          ${total.toLocaleString()}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <Link href="/checkout" onClick={() => setCartOpen(false)} className="block">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-5 bg-dark text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary transition-colors duration-500 rounded-full flex items-center justify-center gap-3"
                      >
                        Proceder al Pago
                      </motion.button>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* ─── Loyalty Modal ─── */}
      <AnimatePresence>
        {loyaltyOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLoyaltyOpen(false)}
              className="fixed inset-0 z-[200] bg-dark/25 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "calc(-50% + 10px)" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "calc(-50% + 10px)" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed left-1/2 top-1/2 z-[210] w-[95%] max-w-lg"
            >
              <LoyaltyCard onClose={() => setLoyaltyOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
