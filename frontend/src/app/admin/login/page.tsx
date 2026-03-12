"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Admin secret from environment variables
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    
    if (password === adminPass) {
      localStorage.setItem("admin_auth", "true");
      router.push("/admin");
    } else {
      setError("Credenciales incorrectas");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2ECE1] pt-32 pb-24 px-6 hardware-accelerated">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          {/* Left: Branding & Editorial Header */}
          <div className="space-y-12">
            <Link href="/" className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-dark/30 hover:text-primary transition-colors">
              <div className="h-px w-4 bg-dark/20 group-hover:w-8 group-hover:bg-primary transition-all" />
              Regresar a la Boutique
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-10 w-48">
                <Image 
                  src="/logotipo.png" 
                  alt="Logo" 
                  width={250} 
                  height={80} 
                  className="w-full h-auto" 
                  priority
                />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6 block">Gestión Interna</span>
              <h1 className="text-editorial-lg text-dark mb-10 uppercase leading-[0.9]">
                SISTEMA <br /> MAESTRO
              </h1>
              <p className="max-w-xs text-[11px] font-bold text-dark/40 uppercase tracking-[0.2em] leading-relaxed">
                Acceso restringido para la gestión de piezas, pedidos y operaciones del Studio.
              </p>
            </motion.div>
          </div>

          {/* Right: Focused Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[3rem] p-8 md:p-14 shadow-2xl shadow-dark/5 border border-white/20"
          >
            <div className="mb-12">
               <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-dark/20 mb-2">Seguridad</h2>
               <p className="text-xl font-black text-dark tracking-tighter uppercase">Validar Identidad</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-10">
              <div className="space-y-4">
                <Label htmlFor="password" title="Clave" className="text-[10px] font-black uppercase tracking-[0.3em] text-dark/40 ml-1">
                  Clave de Acceso
                </Label>
                <div className="relative group">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-16 px-14 rounded-2xl bg-accent/5 border-transparent text-base font-black tracking-widest focus:bg-white focus:border-primary/20 transition-all"
                    required
                    autoFocus
                  />
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-dark/20 group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 rounded-2xl bg-destructive/5 text-destructive text-[9px] font-black uppercase tracking-widest text-center"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-dark text-white rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:bg-primary transition-all duration-500 shadow-xl shadow-dark/10 flex items-center justify-center gap-4 group"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Desbloquear Acceso
                    <Lock className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-14 pt-8 border-t border-dark/5 text-center">
               <p className="text-[9px] font-black text-dark/15 uppercase tracking-[0.6em]">Mi Vaquita Studio • 2026</p>
            </div>
          </motion.div>
        
        </div>
      </div>
    </div>
  );
}
