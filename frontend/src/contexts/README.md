# Contextos React

Este directorio contiene los contextos de React para el manejo de estado global.

## CartContext.tsx

Contexto para manejar el carrito de consulta de productos.

### Funcionalidades

- Agregar productos al carrito
- Remover productos del carrito
- Actualizar cantidades
- Limpiar el carrito
- Persistencia en localStorage
- Cálculo de totales

### Hook useCart

```typescript
const {
  state,
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  toggleCart,
  getTotalItems,
  getTotalPrice
} = useCart()
```

### Estado

```typescript
interface CartState {
  items: CartItem[]
  isOpen: boolean
}
```
