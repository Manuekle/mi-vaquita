"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import type { Producto } from "@/types";

interface ProductModalProps {
  producto: Producto | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ producto, isOpen, onClose }: ProductModalProps) {
  const { addItem } = useCartStore();
  const [cantidad, setCantidad] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!producto) return null;

  const handleAddToCart = () => {
    addItem({
      producto_id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad,
      imagen: producto.imagen || ''
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
      setCantidad(1);
    }, 1000);
  };

  const getCategoryEmoji = (categoria: string) => {
    const emojis: Record<string, string> = {
      cupcakes: '🧁',
      tortas: '🎂',
      galletas: '🍪',
      otros: '🍩'
    };
    return emojis[categoria] || '🍰';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-dark/25 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "calc(-50% + 20px)" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "calc(-50% + 20px)" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed left-1/2 top-1/2 z-50 w-[95%] max-w-lg"
          >
            <div className="bg-white rounded-3xl shadow-elevated overflow-hidden">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 shadow-lg hover:bg-accent/40 transition-colors"
              >
                <X className="h-5 w-5 text-dark" />
              </button>

              {/* Image */}
              <div className="relative h-64 w-full bg-accent/20">
                {producto.imagen ? (
                  <Image
                    src={producto.imagen}
                    alt={producto.nombre}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-8xl">
                    {getCategoryEmoji(producto.categoria)}
                  </div>
                )}
                
                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 rounded-2xl bg-white/90 backdrop-blur-sm font-medium text-sm shadow-lg text-dark">
                    {getCategoryEmoji(producto.categoria)} {producto.categoria}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-bold text-dark mb-2"
                  style={{ fontFamily: "'Playwrite CO Variable', cursive" }}
                >
                  {producto.nombre}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-muted-foreground mb-6"
                >
                  {producto.descripcion}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-between mb-6"
                >
                  <span className="text-3xl font-bold text-primary">
                    ${producto.precio.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Precio por unidad
                  </span>
                </motion.div>

                {/* Quantity selector */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="flex items-center justify-between mb-6"
                >
                  <span className="font-medium text-dark">Cantidad</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      className="h-10 w-10 rounded-2xl bg-accent/50 flex items-center justify-center hover:bg-accent transition-colors"
                    >
                      <Minus className="h-4 w-4 text-dark" />
                    </button>
                    <span className="text-xl font-bold w-12 text-center text-dark">{cantidad}</span>
                    <button
                      onClick={() => setCantidad(cantidad + 1)}
                      className="h-10 w-10 rounded-2xl bg-accent/50 flex items-center justify-center hover:bg-accent transition-colors"
                    >
                      <Plus className="h-4 w-4 text-dark" />
                    </button>
                  </div>
                </motion.div>

                {/* Add to cart button */}
                <motion.button
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                    isAdded
                      ? "bg-green-500 text-white"
                      : "bg-primary text-white shadow-lg shadow-primary/20"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <ShoppingBag className="h-5 w-5" />
                      ¡Agregado al carrito!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5" />
                      Agregar al carrito - ${(producto.precio * cantidad).toLocaleString()}
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
