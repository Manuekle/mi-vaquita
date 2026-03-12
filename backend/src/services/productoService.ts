import { supabase, Producto } from '../db/supabase.js';

export const productoService = {
  async getAll(includeInactive: boolean = false): Promise<Producto[]> {
    if (!supabase) {
      throw new Error('Supabase no configurado. Verifica las credenciales en .env');
    }
    
    let query = supabase.from('productos').select('*');
    if (!includeInactive) {
      query = query.eq('activo', true);
    }
    
    const { data, error } = await query
      .order('categoria', { ascending: true })
      .order('nombre', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getById(id: string): Promise<Producto | null> {
    if (!supabase) {
      throw new Error('Supabase no configurado');
    }
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return data;
  },

  async getByCategoria(categoria: string): Promise<Producto[]> {
    if (!supabase) throw new Error('Supabase no configurado');
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('activo', true)
      .eq('categoria', categoria)
      .order('nombre', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async create(data: Partial<Producto>): Promise<Producto> {
    if (!supabase) throw new Error('Supabase no configurado');
    const { data: producto, error } = await supabase
      .from('productos')
      .insert(data)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return producto;
  },

  async update(id: string, data: Partial<Producto>): Promise<Producto> {
    if (!supabase) throw new Error('Supabase no configurado');
    const { data: producto, error } = await supabase
      .from('productos')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return producto;
  },

  async delete(id: string): Promise<boolean> {
    if (!supabase) throw new Error('Supabase no configurado');
    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  }
};
