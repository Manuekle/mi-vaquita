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

export interface CartItem {
  producto_id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

export interface PedidoItem {
  producto_id: string;
  nombre: string;
  cantidad: number;
  precio: number;
}

export interface Pedido {
  id: string;
  nombre_cliente: string;
  telefono: string;
  estado: string;
  turno: number | null;
  total: number;
  created_at: string;
  items: PedidoItem[];
  whatsapp_url?: string;
}

export interface TurnoData {
  numero: number | null;
  estado: string;
  posicion_encola?: number;
  tiempo_espera?: string;
}
