"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkle, Cake, Coffee, Cookie, Star } from "@phosphor-icons/react";
import { MapPin } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { getProductos } from "@/lib/api";
import type { Producto } from "@/types";

const categorias = [
  { id: "todos", nombre: "Todos" },
  { id: "cupcakes", nombre: "Cupcakes" },
  { id: "tortas", nombre: "Tortas" },
  { id: "galletas", nombre: "Galletas" },
  { id: "otros", nombre: "Otros" },
];

const categoryIcons: Record<string, React.ReactNode> = {
  todos: <Star className="h-3.5 w-3.5" weight="fill" />,
  cupcakes: <Cake className="h-3.5 w-3.5" />,
  tortas: <Cake className="h-3.5 w-3.5" />,
  galletas: <Cookie className="h-3.5 w-3.5" />,
  otros: <Coffee className="h-3.5 w-3.5" />,
};

export default function MenuPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setLoading(true);
    const result = await getProductos();
    if (result.success && result.data) {
      setProductos(result.data);
    }
    setLoading(false);
  };

  const productosFiltrados = categoriaSeleccionada === "todos"
    ? productos
    : productos.filter(p => p.categoria === categoriaSeleccionada);

  return (
    <div className="relative min-h-screen bg-[#F2ECE1] pt-32 pb-24 px-6 md:px-12 overflow-hidden">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-12 border-b border-dark/5 pb-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-8 bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">La Selección</span>
            </motion.div>
            <h1 className="text-editorial-lg text-dark uppercase leading-none">
              COLECCIÓN <br /> COMPLETA
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categorias.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategoriaSeleccionada(cat.id)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  categoriaSeleccionada === cat.id
                    ? "bg-dark text-white shadow-xl shadow-dark/20"
                    : "bg-white/50 text-dark hover:bg-white"
                }`}
              >
                {cat.nombre}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Products Grid — Asymmetric Layout */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex h-96 items-center justify-center"
            >
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-xs font-black uppercase tracking-[0.5em] text-dark/20"
              >
                Cargando Colección...
              </motion.div>
            </motion.div>
          ) : productosFiltrados.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-32"
            >
               <p className="text-xs font-black uppercase tracking-widest text-dark/30">No se encontraron piezas en esta categoría</p>
            </motion.div>
          ) : (
            <motion.div 
              key="product-grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32"
            >
              <AnimatePresence mode="popLayout">
                {productosFiltrados.map((producto, index) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 30 }}
                    transition={{ type: "spring", stiffness: 200, damping: 24 }}
                    key={producto.id} 
                    className={index % 2 === 1 ? "lg:mt-32" : ""}
                  >
                    <ProductCard producto={producto} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info */}
        <div className="mt-48 flex items-center justify-center gap-4 py-12">
            <div className="h-px flex-1 bg-dark/5" />
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-dark/20">Studio • Mi Vaquita • 2026</span>
            <div className="h-px flex-1 bg-dark/5" />
        </div>
      </div>
    </div>
  );
}
