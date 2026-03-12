"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Check, X, Minus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import type { Producto } from "@/types";

interface ProductCardProps {
  producto: Producto;
  index?: number;
}

export function ProductCard({ producto, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [showModal, setShowModal] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setCantidad(1);
    setIsAdded(false);
  };

  const handleAddFromModal = () => {
    addItem({
      producto_id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad,
      imagen: producto.imagen || ""
    });
    setIsAdded(true);
    setTimeout(() => {
      handleCloseModal();
    }, 1000);
  };

  return (
    <>
      {/* --- Card --- */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="group relative cursor-pointer"
        onClick={handleOpenModal}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-accent/5 transition-all duration-700 group-hover:scale-[0.98]">
          {producto.imagen ? (
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-accent/10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-dark/20 rotate-90">No Image</span>
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-dark/0 transition-colors duration-500 group-hover:bg-dark/5" />

          {/* Bottom Bar */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-5">
            <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full">
              <span className="text-[11px] font-black tracking-tighter text-dark uppercase">
                ${producto.precio.toLocaleString()}
              </span>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-lg shadow-primary/30">
              <Plus className="h-5 w-5" strokeWidth={3} />
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-1 px-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary opacity-60">
              {producto.categoria}
            </span>
            <div className="h-px flex-1 bg-dark/5" />
          </div>
          <h3 className="text-lg font-black uppercase tracking-tighter text-dark leading-tight group-hover:text-primary transition-colors duration-300">
            {producto.nombre}
          </h3>
          <p className="text-[11px] text-dark/40 font-bold uppercase tracking-widest leading-relaxed line-clamp-1">
            {producto.descripcion || "Artesanal • Local"}
          </p>
        </div>
      </motion.div>

      {/* --- Modal --- */}
        {mounted && createPortal(
          <AnimatePresence>
            {showModal && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
                {/* Backdrop */}
                <motion.div
                  key="backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleCloseModal}
                  className="absolute inset-0 bg-[#F2ECE1]/80 backdrop-blur-md"
                />

            {/* Modal Panel */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 24 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="relative z-10 w-full max-w-3xl max-h-[90vh] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              {/* Left: Image */}
              <div className="relative h-56 md:h-auto md:w-5/12 flex-shrink-0 bg-accent/5">
                {producto.imagen ? (
                  <Image
                    src={producto.imagen}
                    alt={producto.nombre}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-accent/10">
                    <span className="text-2xl font-black uppercase tracking-[0.5em] text-dark/10">MV</span>
                  </div>
                )}
              </div>

              {/* Right: Content */}
              <div className="flex flex-1 flex-col justify-between p-8 md:p-12 overflow-y-auto">
                {/* Close */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-5 right-5 h-10 w-10 rounded-full bg-accent/10 hover:bg-dark hover:text-white transition-all flex items-center justify-center z-20"
                >
                  <X className="h-4 w-4" strokeWidth={2.5} />
                </button>

                {/* Info */}
                <div className="mb-8">
                  <span className="text-[9px] font-black uppercase tracking-[0.35em] text-primary block mb-3">
                    {producto.categoria} · Colección
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-dark leading-[0.9] mb-4">
                    {producto.nombre}
                  </h2>
                  <p className="text-sm text-dark/60 font-bold leading-relaxed">
                    {producto.descripcion ||
                      "Creación artesanal elaborada con ingredientes seleccionados de la región de Popayán."}
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-6">
                  {/* Price + Quantity */}
                  <div className="flex items-center justify-between py-5 border-t border-b border-dark/5">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-dark/30 block mb-1">Precio</span>
                      <span className="text-2xl font-black tracking-tighter text-dark">${producto.precio.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center bg-accent/10 rounded-full p-1 gap-3">
                      <button
                        onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                        className="h-9 w-9 rounded-full bg-white flex items-center justify-center shadow-sm hover:scale-110 active:scale-90 transition-all"
                      >
                        <Minus className="h-3.5 w-3.5" strokeWidth={3} />
                      </button>
                      <span className="w-6 text-center font-black text-lg text-dark">{cantidad}</span>
                      <button
                        onClick={() => setCantidad(cantidad + 1)}
                        className="h-9 w-9 rounded-full bg-white flex items-center justify-center shadow-sm hover:scale-110 active:scale-90 transition-all"
                      >
                        <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                      </button>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={handleAddFromModal}
                    disabled={isAdded}
                    className={`relative w-full h-14 rounded-full font-black text-xs uppercase tracking-[0.25em] transition-all duration-500 overflow-hidden flex items-center justify-center gap-3 ${
                      isAdded
                        ? "bg-green-500 text-white"
                        : "bg-dark text-white hover:bg-primary shadow-xl shadow-dark/10"
                    }`}
                  >
                    {isAdded ? (
                      <span className="flex items-center gap-2">
                        <Check className="h-4 w-4" strokeWidth={3} />
                        ¡Listo!
                      </span>
                    ) : (
                      <span className="flex items-center gap-3">
                        <ShoppingBag className="h-4 w-4" strokeWidth={2} />
                        Reservar — ${(producto.precio * cantidad).toLocaleString()}
                      </span>
                    )}
                    {/* Shimmer */}
                    <span className="absolute inset-0 bg-white/10 -translate-x-full hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  );
}
