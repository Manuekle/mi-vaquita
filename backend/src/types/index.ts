// Tipos de respuesta API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Tipos de pedido
export interface PedidoItemInput {
  producto_id: string;
  cantidad: number;
}

export interface CreatePedidoInput {
  nombre_cliente: string;
  telefono: string;
  sede: 'campanario' | 'lacteos_colombia';
  tipo_entrega: 'recoger' | 'domicilio';
  direccion?: string;
  items: PedidoItemInput[];
}

// Tipos de turno
export interface TurnoResponse {
  numero: number;
  estado: string;
  posicion_encola?: number;
  tiempo_espera?: string;
}
