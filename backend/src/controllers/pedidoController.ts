import { pedidoService } from '../services/pedidoService.js';
import type { Request, Response } from 'express';

// Función helper para generar URL de WhatsApp
function generarWhatsAppUrl(pedido: any): string {
  const numeroTienda = process.env.WHATSAPP_NUMBER || '573001234567';
  
  const mensaje = `🐄 *PEDIDO #${pedido.turno}*\n` +
    `────────────────\n` +
    `*Cliente:* ${pedido.nombre_cliente}\n` +
    `*Turno:* ${pedido.turno}\n\n` +
    `*Productos:*\n` +
    pedido.items.map((item: any) => 
      `• ${item.cantidad}x ${item.nombre} ($${(item.precio * item.cantidad).toLocaleString()})`
    ).join('\n') +
    `\n\n*Total:* $${pedido.total.toLocaleString()}\n\n` +
    `¡Gracias por tu pedido en Mi Vaquita! 🐄`;

  const mensajeEncoded = encodeURIComponent(mensaje);
  return `https://wa.me/${numeroTienda}?text=${mensajeEncoded}`;
}

export const pedidoController = {
  async create(req: Request, res: Response) {
    try {
      const { nombre_cliente, telefono, items } = req.body;

      // Validaciones básicas
      if (!nombre_cliente || nombre_cliente.length < 2) {
        return res.status(400).json({
          success: false,
          error: 'El nombre debe tener al menos 2 caracteres'
        });
      }

      if (!telefono || !/^\d{10}$/.test(telefono)) {
        return res.status(400).json({
          success: false,
          error: 'El teléfono debe tener 10 dígitos'
        });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'El pedido debe tener al menos un producto'
        });
      }

      const pedido = await pedidoService.create({ nombre_cliente, telefono, items });

      // Generar URL de WhatsApp
      const whatsappUrl = generarWhatsAppUrl(pedido);

      res.status(201).json({
        success: true,
        data: {
          ...pedido,
          whatsapp_url: whatsappUrl
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pedido = await pedidoService.getById(id);
      
      if (!pedido) {
        return res.status(404).json({
          success: false,
          error: 'Pedido no encontrado'
        });
      }

      res.json({
        success: true,
        data: pedido
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const { estado } = req.query;
      const pedidos = await pedidoService.getAll(estado as string);
      res.json({
        success: true,
        data: pedidos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  },

  async updateEstado(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const estadosValidos = ['pendiente', 'preparando', 'listo', 'completado', 'cancelado'];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({
          success: false,
          error: 'Estado inválido'
        });
      }

      const pedido = await pedidoService.updateEstado(id, estado);
      res.json({
        success: true,
        data: pedido
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
};
