# Convención de Commits

Esta convención define cómo deben estructurarse los mensajes de commit en este repositorio para mantener un historial claro, coherente y automatizable.

## Formato

```
<tipo>(módulo): descripción breve en presente

[opcional] Cuerpo del commit explicando el _qué_ y el _por qué_
```

---

## Tipos permitidos

| Tipo       | Descripción                                               |
|------------|-----------------------------------------------------------|
| `feat`     | Nueva funcionalidad                                       |
| `fix`      | Corrección de errores                                     |
| `docs`     | Cambios en la documentación                               |
| `style`    | Cambios de formato (espacios, comas, sin afectar lógica)  |
| `refactor` | Cambios en el código que no agregan ni corrigen funciones |
| `test`     | Agrega o modifica tests                                   |
| `chore`    | Tareas de mantenimiento (dependencias, build, etc.)       |
| `perf`     | Mejora de rendimiento                                     |
| `ci`       | Cambios en configuración de integración continua          |
| `revert`   | Reversión de un commit anterior                           |

---

## Ejemplos

```bash
feat(auth): agrega login con JWT

fix(productos): corrige error al guardar sin nombre

refactor(clientes): separa lógica de validación en un archivo externo

docs: actualiza README con instrucciones de instalación

style: formatea archivos con Prettier

test(pedidos): agrega tests unitarios para validación de fechas
```

---

## Buenas prácticas

- Usa el **modo imperativo**: "agrega", no "agregado" ni "agregando".
- Mantén los commits **atómicos** (una sola cosa por commit).
- Sé **descriptivo pero conciso**.
- El título del commit debe tener **máximo 72 caracteres** si es posible.
- Si el commit está relacionado a un issue/ticket, puedes incluirlo al final:

```bash
feat(usuarios): agrega validación de email obligatorio

Closes #42
```
---

## Créditos

Convención basada en [Conventional Commits](https://www.conventionalcommits.org).
