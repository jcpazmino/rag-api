# Documentación Técnica: Servicio de Fragmentos de Documentos (`services/rag/documentChunkService.js`)

Este documento describe el funcionamiento y la lógica asociada al servicio de gestión de fragmentos (chunks) de documentos en el sistema **RAGInternos**.

---

## Tabla de Contenidos

- [Propósito General](#propósito-general)
- [Funciones Principales](#funciones-principales)
  - [getChunksByDocumentId(documentId)](#getchunksbydocumentiddocumentid)
  - [addChunksToDocument(documentId, chunks)](#addchunkstodocumentdocumentid-chunks)
  - [updateChunk(chunkId, data)](#updatechunkchunkid-data)
  - [deleteChunk(chunkId)](#deletechunkchunkid)
- [Consideraciones](#consideraciones)
- [Ejemplo de Uso](#ejemplo-de-uso)

---

## Propósito General

El servicio `documentChunkService.js` centraliza la lógica para la gestión de fragmentos de documentos. Permite almacenar, consultar, actualizar y eliminar los chunks asociados a un documento, facilitando la búsqueda semántica y el procesamiento eficiente de grandes volúmenes de texto.

[Volver a la tabla de contenidos](#tabla-de-contenidos)

---

## Funciones Principales

### `getChunksByDocumentId(documentId)`

- **Descripción:**  
  Recupera todos los fragmentos (chunks) asociados a un documento específico.
- **Parámetros:**  
  - `documentId`: Identificador del documento.
- **Uso típico:**  
  Obtener todos los chunks para mostrar, procesar o buscar dentro de un documento.

---

### `addChunksToDocument(documentId, chunks)`

- **Descripción:**  
  Agrega una lista de fragmentos a un documento.
- **Parámetros:**  
  - `documentId`: Identificador del documento.
  - `chunks`: Array de objetos chunk (texto, metadatos, etc.).
- **Uso típico:**  
  Al procesar un PDF y fragmentarlo, se almacenan los chunks asociados al documento.

---

### `updateChunk(chunkId, data)`

- **Descripción:**  
  Actualiza la información de un fragmento específico.
- **Parámetros:**  
  - `chunkId`: Identificador del fragmento.
  - `data`: Objeto con los campos a actualizar.
- **Uso típico:**  
  Modificar el contenido o los metadatos de un chunk.

---

### `deleteChunk(chunkId)`

- **Descripción:**  
  Elimina (o marca como inactivo) un fragmento específico.
- **Parámetros:**  
  - `chunkId`: Identificador del fragmento.
- **Uso típico:**  
  Borrar un fragmento que ya no es relevante o necesario.

---

[Volver a la tabla de contenidos](#tabla-de-contenidos)

## Consideraciones

- Los fragmentos pueden estar almacenados en la base de datos o en una base vectorial como ChromaDB.
- El borrado puede ser lógico (marcar como inactivo) para mantener la trazabilidad.
- Se recomienda validar la existencia del documento antes de agregar o consultar chunks.
- El diseño debe permitir búsquedas eficientes y escalables sobre los fragmentos.

[Volver a la tabla de contenidos](#tabla-de-contenidos)

---

## Ejemplo de Uso

### Obtener los chunks de un documento

```js
const chunks = await getChunksByDocumentId(123);
```

### Agregar chunks a un documento

```js
await addChunksToDocument(123, [
  { text: 'Primer fragmento', metadata: { page: 1 } },
  { text: 'Segundo fragmento', metadata: { page: 2 } }
]);
```

### Actualizar un chunk

```js
await updateChunk(456, { text: 'Texto actualizado' });
```

### Eliminar un chunk

```js
await deleteChunk(456);
```

[Volver a la tabla de contenidos](#tabla-de-contenidos)

---

> _Mantén este documento actualizado si cambian los endpoints o la lógica de gestión de fragmentos de documentos._