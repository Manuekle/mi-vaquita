import { supabase, Pedido, PedidoItem } from '../db/supabase.js';
import { productoService } from './productoService.js';
import { turnoService } from './turnoService.js';
import { CreatePedidoInput } from '../types/index.js';

interface PedidoWithItems extends Pedido {
  items: Array<PedidoItem & { nombre: string }>;
}

export const pedidoService = {
  async create(input: CreatePedidoInput): Promise<PedidoWithItems> {
    if (!supabase) throw new Error('Supabase no configurado');
    // Validar que hay items
    if (!input.items || input.items.length === 0) {
      throw new Error('El pedido debe tener al menos un producto');
    }

    // Obtener precios de productos
    const productos = await Promise.all(
      input.items.map(item => productoService.getById(item.producto_id))
    );

    // Validar productos existentes
    for (let i = 0; i < productos.length; i++) {
      if (!productos[i]) {
        throw new Error(`Producto no encontrado: ${input.items[i].producto_id}`);
      }
    }

    // Calcular total
    let total = 0;
    const itemsConPrecio = input.items.map((item, index) => {
      const producto = productos[index]!;
      const precioUnitario = producto.precio;
      const cantidad = item.cantidad;
      const subtotal = precioUnitario * cantidad;
      total += subtotal;
      return {
        producto_id: item.producto_id,
        cantidad,
        precio: precioUnitario,
        nombre: producto.nombre
      };
    });

    // Crear pedido
    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos')
      .insert({
        nombre_cliente: input.nombre_cliente,
        telefono: input.telefono,
        sede: input.sede,
        tipo_entrega: input.tipo_entrega,
        direccion: input.direccion,
        estado: 'pendiente',
        total
      })
      .select()
      .single();

    if (pedidoError) throw new Error(pedidoError.message);

    // Crear items del pedido
    const itemsParaInsertar = itemsConPrecio.map(item => ({
      pedido_id: pedido.id,
      producto_id: item.producto_id,
      cantidad: item.cantidad,
      precio: item.precio
    }));

    const { error: itemsError } = await supabase
      .from('pedido_items')
      .insert(itemsParaInsertar);

    if (itemsError) throw new Error(itemsError.message);

    // Asignar turno en la sede correspondiente
    const numeroTurno = await turnoService.crearTurno(pedido.sede, pedido.id);

    // Actualizar pedido con turno
    const { data: pedidoActualizado } = await supabase
      .from('pedidos')
      .update({ turno: numeroTurno })
      .eq('id', pedido.id)
      .select()
      .single();

    // Obtener items con nombres de productos
    const { data: items } = await supabase
      .from('pedido_items')
      .select('*, productos(nombre)')
      .eq('pedido_id', pedido.id);

    const itemsConNombres = items?.map(item => ({
      ...item,
      nombre: (item as any).productos?.nombre || 'Producto'
    })) || [];

    return {
      ...pedidoActualizado,
      items: itemsConNombres
    };
  },

  async getById(id: string): Promise<PedidoWithItems | null> {
    if (!supabase) throw new Error('Supabase no configurado');
    const { data: pedido, error } = await supabase
      .from('pedidos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    const { data: items } = await supabase
      .from('pedido_items')
      .select('*, productos(nombre)')
      .eq('pedido_id', id);

    const itemsConNombres = items?.map(item => ({
      ...item,
      nombre: (item as any).productos?.nombre || 'Producto'
    })) || [];

    return {
      ...pedido,
      items: itemsConNombres
    };
  },

  async getAll(estado?: string): Promise<Pedido[]> {
    if (!supabase) throw new Error('Supabase no configurado');
    let query = supabase
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false });

    if (estado) {
      query = query.eq('estado', estado);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  },

  async updateEstado(id: string, estado: string): Promise<Pedido> {
    if (!supabase) throw new Error('Supabase no configurado');
    const { data, error } = await supabase
      .from('pedidos')
      .update({ 
        estado,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
};
