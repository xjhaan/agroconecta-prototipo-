# AgroConecta Pamplona – Prototipo de alta fidelidad

Plataforma web adaptable a celular para la venta directa de productos agrícolas de Pamplona, Norte de Santander. Prototipo de la **Fase 4 (Componente Práctico – Práctica Simulada)** de Proyecto de Ingeniería II, UNAD, grupo 202337121_69.

**Autor:** Esneider Jahzeel Sierra González

## Qué incluye

| Pantalla | Historia de usuario |
|---|---|
| Registro e inicio de sesión | HU1, HU2 |
| Publicar producto (productor) | HU3 |
| Catálogo y búsqueda (comprador) | HU4, HU5 |
| Carrito y pedido | HU6 |
| Historial de pedidos | HU7 |
| Bandeja de pedidos (productor) | HU8 |

Quedan para el Sprint 3: precios de referencia (HU9), administración (HU10) y respaldos (HU11).

## Cómo ejecutarlo

1. Abre la carpeta en Visual Studio Code.
2. Instala la extensión **Live Server**, clic derecho en `index.html` y **Open with Live Server**.
3. También funciona abriendo `index.html` directamente en el navegador.

## Cómo probarlo

1. Regístrate como **Productor** y publica un producto.
2. Sal, regístrate como **Comprador**, busca el producto, agrégalo al carrito y confirma el pedido.
3. Ingresa de nuevo como productor y cambia el estado del pedido en la bandeja.

## Limitaciones

- No hay backend ni base de datos, los datos se guardan en el `localStorage` del navegador.
- Las contraseñas se guardan sin cifrar, solo por ser un prototipo. No uses contraseñas reales.
- Las fotos son íconos de muestra.
- No se valida el stock ni hay notificaciones al comprador.

## Estructura

```
index.html
css/styles.css
js/app.js
```

## Uso de inteligencia artificial

Usé Claude (Anthropic) como apoyo para construir la base del prototipo. Revisé y ajusté el resultado, y las decisiones del proyecto son mías.
