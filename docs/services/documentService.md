# Documentación Técnica: Servicio de Documentos (`services/rag/documentService.js`)

Este documento describe el funcionamiento y la lógica asociada al servicio de gestión de documentos en el sistema **RAGInternos**.

---

## Tabla de Contenidos

- [Propósito General](#propósito-general)
- [Funciones Principales](#funciones-principales)
  - [getAllDocuments(pageSize)](#getalldocumentspagesize)
  - [getDocumentById(id)](#getdocumentbyidid)
  - [getDocumentByTitle(title)](#getdocumentbytitletitle)
  - [addDocument(document)](#adddocumentdocument)
  - [updateDocument(id, document)](#updatedocumentid-document)
  - [deleteDocument(id)](#deletedocumentid)
- [Consideraciones](#consideraciones)
- [Ejemplo de Uso](#ejemplo-de-uso)

---

## Propósito General

El servicio `documentService.js` centraliza la lógica para la gestión de documentos, incluyendo operaciones de creación, consulta, actualización y borrado lógico (marcado como inactivo). Interactúa con la base de datos MySQL y el sistema de archivos para almacenar y recuperar tanto los metadatos como los archivos PDF asociados.

[Volver a la tabla de contenidos](#tabla-de-contenidos)

---

## Funciones Principales


### `getAllDocuments(pageSize)`

- **Descripción:**  
  Recupera todos los documentos cuyo campo `status` es `'procesado'`, con un límite opcional de resultados.
- **Parámetros:**  
  - `pageSize` (opcional): Número máximo de documentos a devolver (por defecto 100).
- **Uso típico:**  
  Listar documentos activos para mostrar en el frontend o para procesamiento.

---

### `getDocumentById(id)`

- **Descripción:**  
  Recupera un documento específico por su identificador único.
- **Parámetros:**  
  - `id`: Identificador del documento.
- **Uso típico:**  
  Consultar los detalles de un documento individual.

---

### `getDocumentByTitle(title)`

- **Descripción:**  
  Recupera un documento por coincidencia parcial y case-insensitive en el título.
- **Parámetros:**  
  - `title`: Título (o parte del título) del documento a buscar.
- **Uso típico:**  
  Búsqueda de documentos por título desde el frontend.

---

### `addDocument(document)`

- **Descripción:**  
  Inserta un nuevo documento en la base de datos.
- **Parámetros:**  
  - `document`: Objeto con los datos del documento (título, autor, archivo, etc.).
- **Uso típico:**  
  Registrar un nuevo documento subido por el usuario.

---

### `updateDocument(id, document)`

- **Descripción:**  
  Actualiza los datos de un documento existente.
- **Parámetros:**  
  - `id`: Identificador del documento.
  - `document`: Objeto con los campos a actualizar.
- **Uso típico:**  
  Modificar metadatos o información de un documento ya existente.

---

### `deleteDocument(id)`

- **Descripción:**  
  Realiza un borrado lógico del documento, marcando su campo `status` como `'inactivo'`.
- **Parámetros:**  
  - `id`: Identificador del documento.
- **Uso típico:**  
  Eliminar un documento de la vista del usuario sin borrarlo físicamente de la base de datos.

---

[Volver a la tabla de contenidos](#tabla-de-contenidos)

## Consideraciones

- El borrado de documentos es lógico, no físico, para preservar la integridad y trazabilidad.
- Las búsquedas y listados solo muestran documentos con `status = 'procesado'`.
- Se recomienda validar los datos antes de insertarlos o actualizarlos.
- El servicio puede interactuar con el sistema de archivos para gestionar los PDFs asociados.
- El uso de parámetros preparados en las consultas SQL previene inyección de código.

[Volver a la tabla de contenidos](#tabla-de-contenidos)

---

## Ejemplo de Uso

### Listar documentos activos

```js
const docs = await getAllDocuments(50);
```

### Buscar documento por ID

```js
const doc = await getDocumentById(123);
```

### Buscar documento por título

```js
const doc = await getDocumentByTitle('Manual de Usuario');
```

### Agregar un nuevo documento

```js
const nuevoDoc = await addDocument({
  title: 'Manual de Usuario',
  author: 'Equipo IT',
  file_name: 'manual_usuario.pdf',
  // ...otros campos
});
```

### Actualizar un documento

```js
const actualizado = await updateDocument(123, { title: 'Manual actualizado' });
```

### Eliminar (lógicamente) un documento

```js
await deleteDocument(123);
```

[Volver a la tabla de contenidos](#tabla-de-contenidos)

---

> _Mantén este documento actualizado si cambian los endpoints o la lógica de gestión de documentos._