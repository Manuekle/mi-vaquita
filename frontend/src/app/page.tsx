"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Clock, MapPin, Phone } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { getProductos } from "@/lib/api";
import type { Producto } from "@/types";
import { useUserStore } from "@/store/userStore";
import { Star } from "lucide-react";

function LoyaltySnippet() {
  const { stamps, coupons } = useUserStore();

  if (stamps === 0 && coupons === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-12 flex items-center gap-4 px-6 py-3 rounded-full bg-white/50 backdrop-blur-md border border-dark/5 shadow-sm"
    >
      <div className="h-8 w-8 rounded-full bg-dark flex items-center justify-center text-primary">
        <Star className="h-4 w-4" fill="currentColor" />
      </div>
      <div className="text-left">
        <p className="text-[9px] font-black uppercase tracking-widest text-dark/40 leading-none mb-1">Tu Progreso</p>
        <p className="text-[11px] font-black text-dark uppercase tracking-tighter">
          {coupons > 0 ? `¡Tienes ${coupons} ${coupons === 1 ? 'regalo' : 'regalos'}!` : `${stamps} / 10 sellos colectados`}
        </p>
      </div>
    </motion.div>
  );
}

const categorias = [
  { id: "todos", nombre: "Todos" },
  { id: "cupcakes", nombre: "Cupcakes" },
  { id: "tortas", nombre: "Tortas" },
  { id: "galletas", nombre: "Galletas" },
  { id: "otros", nombre: "Otros" },
];

function CardSkeleton({ offset = false }: { offset?: boolean }) {
  return (
    <div className={offset ? "md:mt-24" : ""}>
      <div className="animate-pulse">
        <div className="aspect-[4/5] w-full rounded-none bg-dark/5" />
        <div className="mt-5 space-y-2 px-1">
          <div className="h-2 w-16 bg-dark/5 rounded-full" />
          <div className="h-4 w-3/4 bg-dark/5 rounded-full" />
          <div className="h-2.5 w-1/2 bg-dark/5 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);

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

  const handleCategoryChange = (id: string) => {
    if (id === categoriaSeleccionada) return;
    setFiltering(true);
    setTimeout(() => {
      setCategoriaSeleccionada(id);
      setFiltering(false);
    }, 180);
  };

  const productosFiltrados = categoriaSeleccionada === "todos"
    ? productos
    : productos.filter(p => p.categoria === categoriaSeleccionada);

  return (
    <div className="relative min-h-screen bg-[#F2ECE1]">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden px-6">
        {/* Decorative rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full border border-dark/5 pointer-events-none"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -right-20 w-[40rem] h-[40rem] rounded-full border border-dark/5 pointer-events-none"
        />

        <div className="container mx-auto flex flex-col items-center text-center z-10">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-block px-4 py-2 rounded-full border border-dark/15 text-[10px] font-black uppercase tracking-[0.4em] text-dark/40 mb-12"
          >
            Edición Artesanal • Popayán
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 w-96 md:w-[35em] flex justify-center"
          >
            <Image
              src="/logotipo.png"
              alt="Logo Mi Vaquita"
              width={500}
              height={500}
              className="w-full h-auto drop-shadow-xl"
              priority
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="max-w-md text-sm font-bold uppercase tracking-[0.15em] text-dark/50 leading-loose mb-16"
          >
            Repostería de autor para quienes buscan el arte en cada bocado.
          </motion.p>

          <LoyaltySnippet />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8 }}
          >
            <Link href="#coleccion">
              <button className="group flex flex-col items-center gap-3">
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-dark/50 group-hover:text-dark transition-colors">
                  Descubrir
                </span>
                <div className="h-14 w-[2px] rounded-full bg-dark/10 overflow-hidden">
                  <motion.div
                    animate={{ y: ["-100%", "200%"] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    className="h-1/2 w-full bg-primary"
                  />
                </div>
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Collection ── */}
      <section
        id="coleccion"
        className="relative py-32 bg-white rounded-t-[4rem] z-20 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.05)]"
        style={{ scrollMarginTop: "80px" }}
      >
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-10">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 mb-5"
              >
                <div className="h-[2px] w-10 bg-primary" />
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-primary">La Selección</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-editorial-lg text-dark"
              >
                NUESTRAS <br /> CREACIONES
              </motion.h2>
            </div>

            {/* Animated Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categorias.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  whileTap={{ scale: 0.93 }}
                  className={`relative px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${categoriaSeleccionada === cat.id
                    ? "text-white"
                    : "text-dark hover:text-dark"
                    }`}
                >
                  {categoriaSeleccionada === cat.id && (
                    <motion.span
                      layoutId="categoryPill"
                      className="absolute inset-0 rounded-full bg-dark"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat.nombre}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Product grid with animated transitions */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} offset={i % 2 === 1} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={`grid-${categoriaSeleccionada}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: filtering ? 0 : 1, y: filtering ? 6 : 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24"
              >
                {productosFiltrados.length === 0 ? (
                  <div className="col-span-full text-center py-32">
                    <p className="text-xs font-black uppercase tracking-widest text-dark/20">
                      No hay piezas en esta categoría
                    </p>
                  </div>
                ) : (
                  productosFiltrados.map((producto, idx) => (
                    <div key={producto.id} className={idx % 2 === 1 ? "md:mt-24" : ""}>
                      <ProductCard producto={producto} index={idx} />
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Manifesto */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-48 grid md:grid-cols-2 gap-24 items-center border-t border-dark/5 pt-32 pb-16"
          >
            <div className="relative aspect-[3/4] flex items-center justify-center">
              {/* Image 2 - Background */}
              <motion.div
                initial={{ opacity: 0, rotate: -8, x: -30, scale: 0.9 }}
                whileInView={{ opacity: 1, rotate: -6, x: -20, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute w-[75%] aspect-square rounded-[2rem] overflow-hidden shadow-2xl top-0 left-0"
              >
                <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-full h-full">
                  <Image src="/locals/local2.png" fill className="object-cover" alt="Ambiente Mi Vaquita" sizes="(max-width: 768px) 80vw, 40vw" />
                </motion.div>
              </motion.div>

              {/* Image 1 - Foreground */}
              <motion.div
                initial={{ opacity: 0, rotate: 6, y: 50 }}
                whileInView={{ opacity: 1, rotate: 4, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute w-[80%] aspect-[4/5] rounded-[2.5rem] bg-white overflow-hidden shadow-xl z-10 bottom-0 right-0 border-8 border-white"
              >
                <motion.div animate={{ scale: [1.05, 1, 1.05] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="w-full h-full">
                  <Image src="/locals/local1.jpg" fill className="object-cover" alt="Local Mi Vaquita" sizes="(max-width: 768px) 80vw, 40vw" />
                </motion.div>
              </motion.div>
            </div>
            <div className="space-y-10">
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-primary">Filosofía</span>
              <h3 className="text-editorial-md text-dark leading-tight">
                MÁS QUE REPOSTERÍA, <br /> ES DISEÑO.
              </h3>
              <p className="text-base text-dark/50 font-bold leading-relaxed">
                Cada pieza es el resultado de un proceso meticuloso donde la técnica se une con la pasión. No vendemos pasteles; creamos momentos a través de la estética y el sabor.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-4">
                {["Origen Local", "Proceso Lento"].map((label, i) => (
                  <div key={label}>
                    <span className="text-[2rem] font-black text-primary leading-none">0{i + 1}.</span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-dark mt-2">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Info Bar ── */}
      <section className="py-24 bg-[#F2ECE1]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { icon: Clock, label: "Horario", val: "8 AM — 8 PM", sub: "Todos los días" },
              { icon: MapPin, label: "Espacio", val: "Popayán", sub: "Barrio Centro" },
              { icon: Phone, label: "Contacto", val: "300 123 4567", sub: "Consultas Directas" },
            ].map(({ icon: Icon, label, val, sub }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-4"
              >
                <div className="h-10 w-10 rounded-full border border-dark/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-dark/60" strokeWidth={2} />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-dark/30 block mb-2">{label}</span>
                  <p className="text-2xl font-black tracking-tighter text-dark mb-1">{val}</p>
                  <p className="text-xs font-bold text-primary">{sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-24 bg-dark text-white px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-20">
            <div>
              <div className="w-48 md:w-64 mb-8">
                <Image
                  src="/logotipo.png"
                  alt="Mi Vaquita"
                  width={256}
                  height={80}
                  className="w-full h-auto"
                />
              </div>
              <p className="max-w-xs text-xs font-bold text-white/30 leading-relaxed uppercase tracking-widest">
                Arte artesanal a través de la repostería en la ciudad blanca.
              </p>
            </div>
            <div className="flex flex-col gap-4 items-end">
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">Síguenos</span>
              <div className="flex gap-8">
                {["Instagram", "WhatsApp", "Facebook"].map((s) => (
                  <span
                    key={s}
                    className="text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/15">
              © 2024 Mi Vaquita Studio. Todos los derechos reservados.
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/15">
              Diseño & Experiencia Digital.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
