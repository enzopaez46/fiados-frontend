"use client";

import { useForm } from "react-hook-form";
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/customers";

import { CustomerFormData } from "@/interfaces/customer";

import { useSnackbar } from "notistack";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

interface CustomerFormProps {
  initial?: CustomerFormData;
  customerId?: number;
  onClose?: () => void; // callback para cerrar el drawer despues de crear/editar el cliente
}

export default function CustomerForm({
  initial,
  customerId,
  onClose,
}: CustomerFormProps) {
  const { enqueueSnackbar } = useSnackbar();

  const form = useForm<CustomerFormData>({
    defaultValues: initial || {},
  });

  const {
    createCustomer,
    isPending: isLoadingCreate,
    //isError: isErrorCreate,
  } = useCreateCustomer();
  const {
    updateCustomer,
    isPending: isLoadingUpdate,
    //isError: isErrorUpdate,
  } = useUpdateCustomer(customerId || 0);

  const onSubmit = async (data: CustomerFormData) => {
    const submitAction = customerId ? updateCustomer : createCustomer;
    try {
      await submitAction(data);
      enqueueSnackbar(`Cliente guardado exitosamente`, {
        variant: "success",
      });
      form.reset();
      customerId && onClose && onClose();
    } catch (error) {
      enqueueSnackbar("Ocurrió un error guardando el cliente.", {
        variant: "error",
      });
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="phonenumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2 mt-6">
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value ?? true}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0">Cliente Activo</FormLabel>
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full mt-2"
          size={"lg"}
          disabled={isLoadingCreate || isLoadingUpdate}
        >
          {isLoadingCreate || isLoadingUpdate
            ? "Guardando..."
            : "Guardar Cliente"}
        </Button>
      </form>
    </Form>
  );
}
