"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronLeft,
  Loader2,
  Package,
  Check,
  X,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto
} from "@/lib/api";
import { Producto } from "@/types";
import { supabase } from "@/lib/supabase";
import { Upload } from "lucide-react";

export default function AdminProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Producto>>({
    nombre: "",
    descripcion: "",
    precio: 0,
    categoria: "general",
    activo: true,
    imagen: ""
  });
  const [uploading, setUploading] = useState(false);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await getProductos(true); // Incluir inactivos
      if (res.success && res.data) {
        setProductos(res.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateProducto(editingId, formData);
      } else {
        await createProducto(formData);
      }
      setEditingId(null);
      setIsAdding(false);
      setFormData({
        nombre: "",
        descripcion: "",
        precio: 0,
        categoria: "general",
        activo: true,
        imagen: ""
      });
      fetchProductos();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = (producto: Producto) => {
    setFormData(producto);
    setEditingId(producto.id);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await deleteProducto(id);
        fetchProductos();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setFormData({ ...formData, imagen: publicUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const filteredProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F2ECE1] pt-32 pb-24 px-6 md:px-12">
      <div className="container mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-20 gap-12 border-b border-dark/5 pb-16 text-center md:text-left">
          <div className="max-w-2xl w-full">
            <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary mb-6 hover:translate-x-[-4px] transition-transform">
              <ChevronLeft className="h-3 w-3" />
              Volver al Panel
            </Link>
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              <div className="h-px w-12 bg-primary/30" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary/60">Inventario</span>
            </div>
            <h1 className="text-editorial-lg text-dark uppercase leading-tight md:leading-none">
              GESTIÓN DE <br className="hidden md:block" /> PRODUCTOS
            </h1>
          </div>
          <Button
            onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ nombre: "", descripcion: "", precio: 0, categoria: "general", activo: true, imagen: "" }); }}
            className="w-full md:w-auto h-16 px-10 rounded-full bg-dark text-white hover:bg-primary transition-all duration-500 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-dark/10"
          >
            <Plus className="h-4 w-4" />
            Añadir Producto
          </Button>
        </div>

        {/* Filters & Search - Standardized */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-dark/30" />
            <Input
              placeholder="BUSCAR NOMBRE..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-20 pl-16 pr-8 rounded-[1.5rem] border-none bg-white/60 focus:bg-white shadow-soft font-bold text-xs uppercase tracking-[0.2em] focus-visible:ring-primary/20 transition-all"
            />
          </div>

          {/* Subtle Category Tabs */}
          <div className="flex items-center gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-hide px-2">
            {['todos', ...new Set(productos.map(p => p.categoria))].map((cat) => (
              <button
                key={cat}
                onClick={() => setSearch(cat === 'todos' ? '' : cat)}
                className={`relative py-4 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${(search.toLowerCase() === cat.toLowerCase() || (cat === 'todos' && search === '')) ? 'text-primary' : 'text-dark/30 hover:text-dark'}`}
              >
                {cat}
                {(search.toLowerCase() === cat.toLowerCase() || (cat === 'todos' && search === '')) && (
                  <motion.div layoutId="product-filter-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main List */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-elevated">
              <div className="flex items-center gap-4 mb-10">
                <Package className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-dark/30">Catálogo ({filteredProductos.length})</span>
                <div className="h-px flex-1 bg-dark/5" />
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-dark/20" />
                </div>
              ) : filteredProductos.length === 0 ? (
                <div className="text-center py-20 px-8">
                  <p className="text-xs font-black uppercase tracking-widest text-dark/20 mb-4">No se encontraron productos</p>
                  <Button variant="ghost" className="text-[10px] uppercase font-black tracking-widest opacity-40" onClick={() => setSearch("")}>Limpiar Busqueda</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProductos.map((producto) => (
                    <motion.div
                      layout
                      key={producto.id}
                      className={`group flex items-center justify-between p-4 rounded-[1.5rem] border transition-all duration-500 ${producto.activo ? 'bg-white border-dark/5 hover:border-primary/20 hover:shadow-lg' : 'bg-muted/30 border-transparent opacity-60'}`}
                    >
                      <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl overflow-hidden bg-accent/20 flex-shrink-0">
                          {producto.imagen ? (
                            <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <ImageIcon className="h-5 w-5 text-dark/20" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-black text-dark uppercase tracking-tight truncate">{producto.nombre}</span>
                          <span className="text-[9px] font-bold text-dark/30 uppercase tracking-widest">{producto.categoria} • ${producto.precio.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(producto)}
                          className="h-12 w-12 rounded-full hover:bg-primary/5 hover:text-primary transition-all group-hover:scale-110"
                        >
                          <Pencil className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(producto.id)}
                          className="h-12 w-12 rounded-full hover:bg-red-50 hover:text-red-500 transition-all group-hover:scale-110"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-4">
            <AnimatePresence mode="wait">
              {(isAdding || editingId) ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="sticky top-32"
                >
                  <Card className="rounded-[2.5rem] border-none shadow-elevated overflow-hidden bg-white">
                    <div className="p-10">
                      <div className="flex items-center justify-between mb-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                          {editingId ? "Editar Producto" : "Nuevo Producto"}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setIsAdding(false); setEditingId(null); }}
                          className="h-8 w-8 rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-6">
                        {/* Image Upload Area */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-dark/40 px-5">Imagen del Producto</label>
                          <div className="relative group overflow-hidden rounded-[2rem] bg-accent/5 border-2 border-dashed border-dark/10 h-48 flex flex-col items-center justify-center transition-all hover:border-primary/30">
                            {formData.imagen ? (
                              <>
                                <img src={formData.imagen} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                  <label className="cursor-pointer h-12 px-6 rounded-full bg-white text-dark text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform">
                                    <Upload className="h-3 w-3" />
                                    Cambiar
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                  </label>
                                  <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, imagen: ""})}
                                    className="h-12 w-12 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-red-500 transition-colors flex items-center justify-center"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </>
                            ) : (
                              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                                {uploading ? (
                                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                ) : (
                                  <>
                                    <ImageIcon className="h-8 w-8 text-dark/10 mb-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-dark/40">Subir Imagen</span>
                                  </>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                              </label>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-dark/40 px-5">Nombre</label>
                          <Input
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            className="h-14 rounded-2xl border-2 border-dark/5 bg-accent/5 px-6 font-bold"
                            placeholder="E.g. Cake de Vainilla"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-dark/40 px-5">Precio</label>
                            <Input
                              type="number"
                              value={formData.precio}
                              onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
                              className="h-14 rounded-2xl border-2 border-dark/5 bg-accent/5 px-6 font-bold"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-dark/40 px-5">Categoría</label>
                            <Input
                              value={formData.categoria}
                              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                              className="h-14 rounded-2xl border-2 border-dark/5 bg-accent/5 px-6 font-bold"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-dark/40 px-5">Descripción</label>
                          <textarea
                            value={formData.descripcion || ""}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            className="w-full min-h-[100px] rounded-2xl border-2 border-dark/5 bg-accent/5 p-6 font-bold text-sm"
                            placeholder="Detalles del producto..."
                          />
                        </div>

                        <div className="flex items-center justify-between p-6 bg-accent/5 rounded-2xl mt-4">
                          <span className="text-[9px] font-black uppercase tracking-widest text-dark/60">Visible en tienda</span>
                          <button
                            onClick={() => setFormData({ ...formData, activo: !formData.activo })}
                            className={`h-10 px-6 rounded-full font-black text-[9px] uppercase tracking-widest transition-all ${formData.activo ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}
                          >
                            {formData.activo ? "ACTIVO" : "OCULTO"}
                          </button>
                        </div>

                        <Button
                          onClick={handleSave}
                          className="w-full h-16 rounded-full bg-dark text-white hover:bg-primary transition-all duration-500 font-black text-[10px] uppercase tracking-[0.3em] mt-4 shadow-xl shadow-dark/10"
                        >
                          {editingId ? "Actualizar Registro" : "Crear Producto"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-20 hidden lg:flex">
                  <div className="w-32 h-32 rounded-full border-2 border-dashed border-dark flex items-center justify-center mb-6">
                    <Plus className="h-8 w-8" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">Selecciona un elemento <br /> para editar o crea uno nuevo</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
