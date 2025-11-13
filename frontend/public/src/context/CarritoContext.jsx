import { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de un CarritoProvider');
  }
  return context;
};

export const CarritoProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    // Cargar carrito del localStorage al iniciar
    const savedCart = localStorage.getItem('carrito');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(items));
  }, [items]);

  const agregarItem = (producto, cantidad = 1, diasRenta = 1, fechaInicio = null, fechaFin = null) => {
    setItems(prevItems => {
      // Verificar si el producto ya existe en el carrito
      const existingIndex = prevItems.findIndex(item => item.id === producto.id);
      
      if (existingIndex >= 0) {
        // Si existe, actualizar cantidad
        const newItems = [...prevItems];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          cantidad: newItems[existingIndex].cantidad + cantidad
        };
        return newItems;
      } else {
        // Si no existe, agregar nuevo item
        const newItem = {
          id: producto.id || producto.producto_id,
          tipo: 'producto',
          nombre: producto.name || producto.nombre,
          codigo: producto.codigo_producto || `PROD-${producto.id}`,
          imagen: producto.imageUrl || producto.imagen_url || '/images/silla.jpg',
          precioPorDia: producto.price || producto.precio_por_dia,
          cantidad: cantidad,
          diasRenta: diasRenta,
          fechaInicio: fechaInicio || new Date().toISOString().split('T')[0],
          fechaFin: fechaFin || new Date(Date.now() + diasRenta * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          disponible: true,
          stock: producto.stock || producto.stock_disponible
        };
        return [...prevItems, newItem];
      }
    });
  };

  const eliminarItem = (itemId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const actualizarCantidad = (itemId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarItem(itemId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  };

  const actualizarDias = (itemId, nuevosDias) => {
    if (nuevosDias <= 0) return;
    
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId) {
          const fechaInicio = new Date(item.fechaInicio);
          const fechaFin = new Date(fechaInicio.getTime() + nuevosDias * 24 * 60 * 60 * 1000);
          return {
            ...item,
            diasRenta: nuevosDias,
            fechaFin: fechaFin.toISOString().split('T')[0]
          };
        }
        return item;
      })
    );
  };

  const limpiarCarrito = () => {
    setItems([]);
  };

  const calcularSubtotal = (item) => {
    const precioBase = item.precioPorDia * item.cantidad * item.diasRenta;
    if (item.descuento) {
      return precioBase * (1 - item.descuento / 100);
    }
    return precioBase;
  };

  const calcularTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + calcularSubtotal(item), 0);
    const iva = subtotal * 0.19;
    return {
      subtotal,
      iva,
      total: subtotal + iva
    };
  };

  const cantidadItems = items.reduce((sum, item) => sum + item.cantidad, 0);

  const value = {
    items,
    agregarItem,
    eliminarItem,
    actualizarCantidad,
    actualizarDias,
    limpiarCarrito,
    calcularSubtotal,
    calcularTotal,
    cantidadItems
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};
