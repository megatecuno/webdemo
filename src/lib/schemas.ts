
import { z } from "zod";

export const publicationSchema = z.object({
  name: z.string().min(3, { message: "El título debe tener al menos 3 caracteres." }).max(100, { message: "El título no puede tener más de 100 caracteres." }),
  category: z.string({ required_error: "Debes seleccionar una categoría." }).min(1, { message: "Debes seleccionar una categoría." }),
  price: z.number().min(0, { message: "El precio no puede ser negativo." }),
  condition: z.enum(["new", "used", "refurbished"], { required_error: "Debes seleccionar una condición." }),
  discountPercentage: z.number().min(0).max(100).optional(),
  description: z.string().max(5000, { message: "La descripción no puede tener más de 5000 caracteres." }).optional(),
  images: z.array(z.string()).min(1, { message: "Debes subir al menos una imagen." }).max(5, { message: "No puedes subir más de 5 imágenes." }),
});
