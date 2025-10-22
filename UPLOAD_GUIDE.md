# 📸 Guía de Upload de Imágenes

## 🎯 **Funcionalidad Implementada** a

El sistema ahora incluye un componente de upload de imágenes con las siguientes características:

### ✨ **Características del Upload:**

- **Drag & Drop**: Arrastra imágenes directamente al área de upload
- **Click para seleccionar**: Haz clic para abrir el selector de archivos
- **Validación automática**: Solo acepta archivos de imagen (PNG, JPG, GIF)
- **Límite de tamaño**: Máximo 5MB por archivo
- **Nombres únicos**: Genera nombres únicos para evitar conflictos
- **Vista previa**: Muestra la imagen subida con opción de eliminar
- **Feedback visual**: Estados de carga y errores claros

### 📁 **Ubicación de Archivos:**

- **Directorio**: `/public/uploads/`
- **URLs**: `/uploads/nombre-del-archivo.ext`
- **Formato**: `upload-timestamp-randomstring.extension`

## 🚀 **Cómo Usar el Upload:**

### 1. **En Slides (`/admin/slides`)**
1. Haz clic en "Nuevo Slide" o "Editar" un slide existente
2. En el campo "Imagen", verás el área de upload
3. Arrastra una imagen o haz clic para seleccionar
4. La imagen se subirá automáticamente
5. Verás una vista previa con opción de eliminar

### 2. **En Productos (`/admin/products`)**
1. Haz clic en "Nuevo Producto" o "Editar" un producto existente
2. En el campo "Imagen", usa el componente de upload
3. Sube la imagen del producto
4. La URL se guardará automáticamente en la base de datos

### 3. **En Servicios (`/admin/services`)**
1. Haz clic en "Nuevo Servicio" o "Editar" un servicio existente
2. En el campo "Imagen (opcional)", sube la imagen
3. Los servicios pueden tener imágenes opcionales

## 🛠️ **Componente ImageUpload:**

```tsx
import ImageUpload from '@/components/ImageUpload'

<ImageUpload
  onImageUpload={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
  currentImage={formData.image}
/>
```

### **Props:**
- `onImageUpload`: Función que se ejecuta cuando se sube una imagen
- `currentImage`: URL de la imagen actual (opcional)
- `className`: Clases CSS adicionales (opcional)

## 🔧 **API de Upload:**

### **Endpoint:** `POST /api/upload`

### **FormData:**
```javascript
const formData = new FormData()
formData.append('image', file)
```

### **Respuesta:**
```json
{
  "imageUrl": "/uploads/upload-1234567890-abc123.jpg"
}
```

### **Validaciones:**
- ✅ Solo archivos de imagen (PNG, JPG, GIF)
- ✅ Máximo 5MB
- ✅ Nombres únicos automáticos
- ✅ Creación automática del directorio

## 📋 **Ejemplo de Uso Completo:**

```tsx
const [formData, setFormData] = useState({
  name: '',
  description: '',
  image: ''
})

const handleImageUpload = (imageUrl: string) => {
  setFormData(prev => ({ ...prev, image: imageUrl }))
}

// En el formulario:
<ImageUpload
  onImageUpload={handleImageUpload}
  currentImage={formData.image}
/>
```

## 🎨 **Estados Visuales:**

1. **Vacío**: Área punteada con icono de imagen
2. **Drag Over**: Borde azul con fondo azul claro
3. **Subiendo**: Texto "Subiendo imagen..."
4. **Con imagen**: Vista previa con botón de eliminar
5. **Error**: Alert con mensaje de error

## 🔒 **Seguridad:**

- ✅ Validación de tipo de archivo
- ✅ Límite de tamaño
- ✅ Nombres únicos para evitar sobrescritura
- ✅ Sanitización de nombres de archivo
- ✅ Directorio específico para uploads

## 🚨 **Solución de Problemas:**

### **Error: "El archivo es demasiado grande"**
- Reduce el tamaño de la imagen (máximo 5MB)

### **Error: "Solo se permiten archivos de imagen"**
- Asegúrate de que el archivo sea PNG, JPG o GIF

### **Error: "Error al subir la imagen"**
- Verifica que el directorio `/public/uploads/` exista
- Revisa los permisos del servidor

### **Imagen no se muestra**
- Verifica que la URL en la base de datos sea correcta
- Asegúrate de que el archivo esté en `/public/uploads/`

## 📝 **Notas Importantes:**

1. **Backup**: Las imágenes se guardan localmente en `/public/uploads/`
2. **Producción**: Considera usar un servicio de almacenamiento en la nube
3. **Limpieza**: Implementa limpieza periódica de archivos no utilizados
4. **Optimización**: Considera comprimir imágenes automáticamente

---

¡El sistema de upload de imágenes está listo para usar! 🎉
