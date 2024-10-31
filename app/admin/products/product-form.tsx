import { Dispatch, SetStateAction, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CreateOrUpdateProductSchema } from "@/app/admin/products/schema";
import { Input } from "@/components/ui/input";
import { Category } from "@/app/admin/categories/categories.types";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Props = {
  form: UseFormReturn<CreateOrUpdateProductSchema>;
  onSubmit: (data: CreateOrUpdateProductSchema) => void;
  categories: Category[];

  defaultValues: CreateOrUpdateProductSchema | null;
};

export const ProductForm = ({
  form,
  onSubmit,
  categories,

  defaultValues,
}: Props) => {
  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    } else {
      form.reset({
        flavor: "",
        category: "",
        price: "",
        heroImage: undefined,
        size: undefined,
      });
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger disabled={isSubmitting} className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="flavor"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Flavor</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter flavor"
                  {...field}
                  className="col-span-3"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Size</FormLabel>
              <FormControl>
                <RadioGroup
                  className="flex"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="6pcs" id="6pcs" />
                    </FormControl>
                    <FormLabel htmlFor="6pcs">6 pcs.</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="12pcs" id="12pcs" />
                    </FormControl>
                    <FormLabel htmlFor="12pcs">12 pcs.</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  id="price"
                  type="number"
                  className="col-span-3"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="heroImage"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Product Image</FormLabel>
              <FormControl className="col-span-3">
                <Input
                  type="file"
                  accept="image/*"
                  {...form.register("heroImage")}
                  onChange={(event) => {
                    field.onChange(event.target.files?.[0]);
                  }}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button disabled={isSubmitting} type="submit">
            Add Product
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
