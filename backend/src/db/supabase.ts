import 'dotenv/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

// Debug
console.log('DEBUG - SUPABASE_URL:', supabaseUrl ? '****' + supabaseUrl.slice(-10) : 'empty');
console.log('DEBUG - SUPABASE_KEY:', supabaseKey ? 'present' : 'empty');

// Solo crear cliente si hay credenciales válidas
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey && supabaseUrl.includes('supabase.co')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase conectado');
  } catch (error) {
    console.log('❌ Error conectando a Supabase:', error);
  }
} else {
  console.log('⚠️ Credenciales de Supabase no configuradas');
}

export { supabase };

// Tipos para la base de datos
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagen: string | null;
  categoria: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Pedido {
  id: string;
  nombre_cliente: string;
  telefono: string;
  estado: string;
  turno: number | null;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface PedidoItem {
  id: string;
  pedido_id: string;
  producto_id: string;
  cantidad: number;
  precio: number;
  created_at: string;
}

export interface Turno {
  id: string;
  numero: number;
  pedido_id: string | null;
  estado: string;
  created_at: string;
}
