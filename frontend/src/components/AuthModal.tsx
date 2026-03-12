"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const { setUser } = useUserStore();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate auth for now as it's optional
    setTimeout(() => {
      setUser({
        id: 'user_123',
        email: email,
        name: email.split('@')[0].toUpperCase(),
      });
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-dark/25 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "calc(-50% + 10px)" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "calc(-50% + 10px)" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-[210] w-[95%] max-w-md"
          >
            <div className="bg-white rounded-[3rem] p-12 shadow-2xl overflow-hidden relative border border-dark/5">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-accent/10 hover:bg-accent/40 text-dark transition-all z-20"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-12 text-center">
                <h2 className="text-4xl font-black tracking-tighter text-dark uppercase leading-none italic">
                  {isLogin ? 'Bienvenido' : 'Crea tu Cuenta'}
                </h2>
                <p className="text-[10px] font-bold text-dark/30 uppercase tracking-[0.2em] mt-5">
                  Sincroniza tus sellos en todos tus dispositivos
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-dark/40 px-5">Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-dark/10 group-focus-within:text-primary transition-colors" />
                      <Input
                        type="email"
                        placeholder="TU@EMAIL.COM"
                        className="h-14 pl-14 rounded-2xl border-2 border-dark/5 bg-accent/5 pr-6 font-bold text-base uppercase tracking-widest focus:bg-white focus:border-primary/20 transition-all placeholder:text-dark/10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-dark/40 px-5">Contraseña</label>
                    <div className="relative group">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-dark/10 group-focus-within:text-primary transition-colors" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="h-14 pl-14 rounded-2xl border-2 border-dark/5 bg-accent/5 pr-6 font-bold text-base uppercase tracking-widest focus:bg-white focus:border-primary/20 transition-all placeholder:text-dark/10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button
                  disabled={loading}
                  className="w-full h-14 rounded-full bg-dark text-white font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-lg"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                    <div className="flex items-center gap-3">
                      {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                      <ArrowRight className="h-4 w-4" strokeWidth={3} />
                    </div>
                  )}
                </Button>
              </form>

              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full mt-8 text-[9px] font-black uppercase tracking-widest text-dark/30 hover:text-dark transition-colors"
              >
                {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Entrar'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
