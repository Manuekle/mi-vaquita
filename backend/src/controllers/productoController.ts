import { productoService } from '../services/productoService.js';
import type { Request, Response } from 'express';

export const productoController = {
  async getAll(req: Request, res: Response) {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const productos = await productoService.getAll(includeInactive);
      res.json({
        success: true,
        data: productos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const producto = await productoService.getById(id);
      
      if (!producto) {
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado'
        });
      }

      res.json({
        success: true,
        data: producto
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const producto = await productoService.create(req.body);
      res.status(201).json({ success: true, data: producto });
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Error desconocido' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const producto = await productoService.update(id, req.body);
      res.json({ success: true, data: producto });
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Error desconocido' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await productoService.delete(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Error desconocido' });
    }
  }
};
