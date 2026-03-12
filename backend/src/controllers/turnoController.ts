import { turnoService } from '../services/turnoService.js';
import type { Request, Response } from 'express';

export const turnoController = {
  async obtenerActual(req: Request, res: Response) {
    try {
      const turno = await turnoService.obtenerTurnoActual();
      
      if (!turno) {
        return res.json({
          success: true,
          data: {
            mensaje: 'No hay turnos en espera',
            numero: null
          }
        });
      }

      // Calcular tiempo estimado
      const posicion = await turnoService.obtenerPosicionEnCola(turno.numero);
      const tiempoEstimado = posicion * 5; // 5 minutos por turno

      res.json({
        success: true,
        data: {
          numero: turno.numero,
          estado: turno.estado,
          posicion_encola: posicion,
          tiempo_espera: `aproximadamente ${tiempoEstimado} minutos`
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  },

  async obtenerProximo(req: Request, res: Response) {
    try {
      const turno = await turnoService.obtenerSiguienteEnCola();
      
      if (!turno) {
        return res.json({
          success: true,
          data: {
            mensaje: 'No hay más turnos en cola',
            numero: null
          }
        });
      }

      const posicion = await turnoService.obtenerPosicionEnCola(turno.numero);

      res.json({
        success: true,
        data: {
          numero: turno.numero,
          posicion_encola: posicion
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  },

  async avanzar(req: Request, res: Response) {
    try {
      const resultado = await turnoService.avanzarTurno();
      
      if (!resultado) {
        return res.json({
          success: true,
          data: {
            mensaje: 'No hay más turnos por llamar'
          }
        });
      }

      res.json({
        success: true,
        data: {
          turno_anterior: resultado.turnoAnterior,
          turno_actual: resultado.turnoActual,
          mensaje: `Turno ${resultado.turnoActual} llamado`
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
};
