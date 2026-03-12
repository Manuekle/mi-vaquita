import { supabase, Turno } from '../db/supabase.js';

export const turnoService = {
  async obtenerTurnoActual(): Promise<Turno | null> {
    if (!supabase) throw new Error('Supabase no configurado');
    const { data, error } = await supabase
      .from('turnos')
      .select('*')
      .eq('estado', 'activo')
      .order('numero', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return data;
  },

  async obtenerSiguienteEnCola(): Promise<Turno | null> {
    if (!supabase) throw new Error('Supabase no configurado');
    const { data, error } = await supabase
      .from('turnos')
      .select('*')
      .eq('estado', 'pendiente')
      .order('numero', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return data;
  },

  async obtenerPosicionEnCola(numero: number): Promise<number> {
    if (!supabase) throw new Error('Supabase no configurado');
    const { data, error } = await supabase
      .from('turnos')
      .select('numero')
      .eq('estado', 'pendiente')
      .lt('numero', numero)
      .order('numero', { ascending: false });

    if (error) throw new Error(error.message);
    return (data?.length || 0) + 1;
  },

  async crearTurno(pedidoId: string): Promise<number> {
    // Obtener el último turno del día
    const hoy = new Date();
    const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()).toISOString();
    
    if (!supabase) throw new Error('Supabase no configurado');
    const { data: ultimoTurno } = await supabase
      .from('turnos')
      .select('numero')
      .gte('created_at', inicioDia)
      .order('numero', { ascending: false })
      .limit(1)
      .single();

    const nuevoNumero = (ultimoTurno?.numero || 0) + 1;

    if (!supabase) throw new Error('Supabase no configurado');
    // Crear el nuevo turno
    const { error } = await supabase
      .from('turnos')
      .insert({
        numero: nuevoNumero,
        pedido_id: pedidoId,
        estado: 'activo'
      });

    if (error) throw new Error(error.message);
    return nuevoNumero;
  },

  async avanzarTurno(): Promise<{ turnoAnterior: number; turnoActual: number } | null> {
    const turnoActual = await this.obtenerTurnoActual();
    
    if (!turnoActual) return null;

    const numeroAnterior = turnoActual.numero;

    // Marcar turno actual como completado
    if (!supabase) throw new Error('Supabase no configurado');
    await supabase
      .from('turnos')
      .update({ estado: 'completado' })
      .eq('id', turnoActual.id);

    // Obtener siguiente turno en cola
    const siguienteTurno = await this.obtenerSiguienteEnCola();
    
    if (!siguienteTurno) return null;

    // Activar siguiente turno
    if (!supabase) throw new Error('Supabase no configurado');
    await supabase
      .from('turnos')
      .update({ estado: 'activo' })
      .eq('id', siguienteTurno.id);

    // Actualizar pedido asociado
    if (siguienteTurno.pedido_id) {
      if (!supabase) throw new Error('Supabase no configurado');
      await supabase
        .from('pedidos')
        .update({ estado: 'preparando' })
        .eq('id', siguienteTurno.pedido_id);
    }

    return {
      turnoAnterior: numeroAnterior,
      turnoActual: siguienteTurno.numero
    };
  }
};
