const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de conexión'
    };
  }
}

export interface CreatePedidoInput {
  nombre_cliente: string;
  telefono: string;
  sede: 'campanario' | 'lacteos_colombia';
  tipo_entrega: 'recoger' | 'domicilio';
  direccion?: string;
  items: Array<{
    producto_id: string;
    cantidad: number;
  }>;
}

export async function getProductos(includeInactive: boolean = false) {
  const query = includeInactive ? '?includeInactive=true' : '';
  return fetchApi<any[]>(`/productos${query}`);
}

export async function getProductoById(id: string) {
  return fetchApi<any>(`/productos/${id}`);
}

export async function createProducto(data: any) {
  return fetchApi<any>('/productos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProducto(id: string, data: any) {
  return fetchApi<any>(`/productos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProducto(id: string) {
  return fetchApi<any>(`/productos/${id}`, {
    method: 'DELETE',
  });
}

export async function createPedido(data: CreatePedidoInput) {
  return fetchApi<any>('/pedidos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getPedidoById(id: string) {
  return fetchApi<any>(`/pedidos/${id}`);
}

export async function getPedidos(estado?: string) {
  const query = estado ? `?estado=${estado}` : '';
  return fetchApi<any[]>(`/pedidos${query}`);
}

export async function updatePedidoEstado(id: string, estado: string) {
  return fetchApi<any>(`/pedidos/${id}/estado`, {
    method: 'PUT',
    body: JSON.stringify({ estado }),
  });
}

export async function getTurnoActual() {
  return fetchApi<any>('/turnos/actual');
}

export async function avanzarTurno() {
  return fetchApi<any>('/turnos/avanzar', {
    method: 'POST',
  });
}
