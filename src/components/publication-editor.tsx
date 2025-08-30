
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import type { Product } from "@/lib/types";
import { publicationSchema } from "@/lib/schemas";
import { UploadCloud, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/app-context";

type PublicationFormValues = z.infer<typeof publicationSchema>;

interface PublicationEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

export function PublicationEditor({ open, onOpenChange, product }: PublicationEditorProps) {
  const { toast } = useToast();
  const { categories, addProduct, updateProduct } = useAppContext();
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>(Array(5).fill(null));
  const [imageFiles, setImageFiles] = useState<(File | null)[]>(Array(5).fill(null));
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const defaultValues: PublicationFormValues = {
    name: "",
    category: "",
    price: 0,
    condition: "new",
    discountPercentage: 0,
    description: "",
    images: [],
  };

  const form = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      if (product) {
        form.reset({
          name: product.name,
          category: product.category,
          price: product.price,
          condition: product.condition || "new",
          discountPercentage: product.discountPrice
            ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
            : 0,
          description: product.description,
          images: product.images,
        });
        const previews = [...product.images, ...Array(5 - product.images.length).fill(null)];
        setImagePreviews(previews);
        setImageFiles(Array(5).fill(null));
      } else {
        form.reset(defaultValues);
        setImagePreviews(Array(5).fill(null));
        setImageFiles(Array(5).fill(null));
      }
    }
  }, [product, open, form]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImageFiles = [...imageFiles];
      newImageFiles[index] = file;
      setImageFiles(newImageFiles);

      const newImagePreviews = [...imagePreviews];
      newImagePreviews[index] = URL.createObjectURL(file);
      setImagePreviews(newImagePreviews);
      
      form.setValue("images", newImagePreviews.filter(p => p !== null) as string[], { shouldValidate: true });
    }
  };
  
  const removeImage = (index: number) => {
    const newImageFiles = [...imageFiles];
    newImageFiles[index] = null;
    setImageFiles(newImageFiles);

    const newImagePreviews = [...imagePreviews];
    const removedPreview = newImagePreviews[index];
    if (removedPreview && removedPreview.startsWith('blob:')) {
      URL.revokeObjectURL(removedPreview);
    }
    newImagePreviews[index] = null;
    setImagePreviews(newImagePreviews);
    
    form.setValue("images", newImagePreviews.filter(p => p !== null) as string[], { shouldValidate: true });
  };
  
  const handleUploadClick = (index: number) => {
    fileInputRefs.current[index]?.click();
  }


  function onSubmit(data: PublicationFormValues) {
    const finalImages = imagePreviews.filter(p => p !== null) as string[];

    const productData = {
        name: data.name,
        description: data.description || '',
        price: data.price,
        discountPrice: data.discountPercentage 
            ? data.price * (1 - data.discountPercentage / 100)
            : undefined,
        images: finalImages.length > 0 ? finalImages : ['https://placehold.co/600x600.png'],
        category: data.category,
        condition: data.condition,
    };
    
    if (product) {
        updateProduct({
            ...product,
            ...productData
        });
    } else {
        addProduct(productData);
    }

    toast({
      title: `Publicación ${product ? 'actualizada' : 'creada'}`,
      description: `El producto "${data.name}" ha sido guardado correctamente.`,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Publicación" : "Crear Nueva Publicación"}</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} id="publication-form" className="space-y-8">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imágenes (hasta 5)</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                        {Array.from({ length: 5 }).map((_, index) => {
                           const src = imagePreviews[index];
                           return (
                             <div key={index} className="relative aspect-square">
                              {src ? (
                                <div className="group">
                                  <Image
                                    src={src}
                                    alt={`Vista previa ${index + 1}`}
                                    width={150}
                                    height={150}
                                    className="w-full h-full object-cover rounded-lg border"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    onClick={() => removeImage(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                 <div 
                                   className="flex flex-col items-center justify-center w-full h-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                   onClick={() => handleUploadClick(index)}
                                 >
                                   <div className="flex flex-col items-center justify-center text-center">
                                     <UploadCloud className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                                     <p className="text-xs text-gray-500 dark:text-gray-400">
                                       Subir imagen
                                     </p>
                                   </div>
                                   <input 
                                     type="file" 
                                     className="hidden" 
                                     accept="image/*" 
                                     onChange={(e) => handleImageChange(e, index)}
                                     ref={(el) => (fileInputRefs.current[index] = el)}
                                   />
                                 </div>
                              )}
                            </div>
                           )
                        })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Smartphone X-Pro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ej: 999.99" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condición</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona la condición" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="new">Nuevo</SelectItem>
                          <SelectItem value="used">Usado</SelectItem>
                          <SelectItem value="refurbished">Reacondicionado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descuento (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ej: 10" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe tu producto en detalle..."
                        className="resize-y min-h-[150px]"
                        maxLength={5000}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Límite de 5000 caracteres. Caracteres restantes: {5000 - (field.value?.length || 0)}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter className="pt-4 pr-6">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" form="publication-form" onClick={form.handleSubmit(onSubmit)}>
              Guardar Publicación
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
