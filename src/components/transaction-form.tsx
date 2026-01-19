"use client";

import { useForm } from "react-hook-form";

import { useCreateTransaction } from "@/hooks/customers";

import { TransactionInput } from "@/interfaces/transaction";

import { useSnackbar } from "notistack";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

/*
interface TransactionFormData {
    type: TransactionType;
    amount: number;
    description?: string;
}
    por el momento TransactionInput es lo mismo que TransactionFormData
    quizas mas adelante cambie y convenga tener ambas interfaces
*/

interface TransactionFormProps {
  //initial?: TransactionInput;
  customerId: number;
  onClose?: () => void; // callback para cerrar el drawer despues de crear la transaccion
}

export default function TransactionForm({
  //initial,
  customerId,
  onClose,
}: TransactionFormProps) {
  const { enqueueSnackbar } = useSnackbar();

  const { createTransaction } = useCreateTransaction(customerId);

  const form = useForm<TransactionInput>({
    defaultValues: {
      type: "COMPRA",
      amount: undefined,
      description: "",
    },
  });

  async function onSubmit(data: TransactionInput) {
    try {
      await createTransaction({
        type: data.type,
        amount: data.amount,
        description: data.description || undefined,
      });

      form.reset();
      enqueueSnackbar("Movimiento creado con éxito", { variant: "success" });
      onClose && onClose();
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar(err.message || "Error al crear el movimiento", {
        variant: "error",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col h-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-3 flex-1">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Movimiento</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COMPRA">Compra</SelectItem>
                        <SelectItem value="PAGO">Pago</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      step="1.00"
                      min="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        )
                      }
                      value={field.value ?? ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: Detergente, Arroz..."
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Button
            type="submit"
            className="w-full"
            size={"lg"}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Guardando..."
              : "Guardar Movimiento"}
          </Button>
          <Button
            type="button"
            className="w-full"
            size={"lg"}
            variant={"outline"}
            disabled={form.formState.isSubmitting}
            onClick={onClose}
          >
            Cerrar
          </Button>
        </div>
      </form>
    </Form>
  );
}
