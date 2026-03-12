import { supabase, Turno } from '../db/supabase.js';

export const turnoService = {
  async obtenerTurnoActual(sede: 'campanario' | 'lacteos_colombia'): Promise<Turno | null> {
    if (!supabase) throw new Error('Supabase no configurado');
    const { data, error } = await supabase
      .from('turnos')
      .select('*')
      .eq('estado', 'activo')
      .eq('sede', sede)
      .order('numero', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return data;
  },

  async obtenerSiguienteEnCola(sede: 'campanario' | 'lacteos_colombia'): Promise<Turno | null> {
    if (!supabase) throw new Error('Supabase no configurado');
    const { data, error } = await supabase
      .from('turnos')
      .select('*')
      .eq('estado', 'pendiente')
      .eq('sede', sede)
      .order('numero', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return data;
  },

  async obtenerPosicionEnCola(sede: 'campanario' | 'lacteos_colombia', numero: number): Promise<number> {
    if (!supabase) throw new Error('Supabase no configurado');
    const { data, error } = await supabase
      .from('turnos')
      .select('numero')
      .eq('estado', 'pendiente')
      .eq('sede', sede)
      .lt('numero', numero)
      .order('numero', { ascending: false });

    if (error) throw new Error(error.message);
    return (data?.length || 0) + 1;
  },

  async crearTurno(sede: 'campanario' | 'lacteos_colombia', pedidoId: string): Promise<number> {
    // Obtener el último turno del día para esa sede
    const hoy = new Date();
    const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()).toISOString();
    
    if (!supabase) throw new Error('Supabase no configurado');
    const { data: ultimoTurno } = await supabase
      .from('turnos')
      .select('numero')
      .eq('sede', sede)
      .gte('created_at', inicioDia)
      .order('numero', { ascending: false })
      .limit(1)
      .single();

    const nuevoNumero = (ultimoTurno?.numero || 0) + 1;

    // Crear el nuevo turno
    const { error } = await supabase
      .from('turnos')
      .insert({
        numero: nuevoNumero,
        pedido_id: pedidoId,
        sede: sede,
        estado: 'activo'
      });

    if (error) throw new Error(error.message);
    return nuevoNumero;
  },

  async avanzarTurno(sede: 'campanario' | 'lacteos_colombia'): Promise<{ turnoAnterior: number; turnoActual: number } | null> {
    const turnoActual = await this.obtenerTurnoActual(sede);
    
    if (!turnoActual) return null;

    const numeroAnterior = turnoActual.numero;

    // Marcar turno actual como completado
    if (!supabase) throw new Error('Supabase no configurado');
    await supabase
      .from('turnos')
      .update({ estado: 'completado' })
      .eq('id', turnoActual.id);

    // Obtener siguiente turno en cola para esa sede
    const siguienteTurno = await this.obtenerSiguienteEnCola(sede);
    
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
