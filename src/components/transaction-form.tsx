"use client";

import { useForm, Controller } from "react-hook-form";

import { useCreateTransaction } from "@/hooks/customers";

import { TransactionInput } from "@/interfaces/transaction";

import { useSnackbar } from "notistack";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
}

export default function TransactionForm({
  //initial,
  customerId,
}: TransactionFormProps) {
  const { enqueueSnackbar } = useSnackbar();

  const { createTransaction } = useCreateTransaction(customerId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<TransactionInput>({
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

      reset();
      enqueueSnackbar("Movimiento creado con éxito", { variant: "success" });
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar(err.message || "Error al crear el movimiento", {
        variant: "error",
      });
    }
  }
  return (
    <div>
      <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Movimiento</Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COMPRA">Compra</SelectItem>
                  <SelectItem value="PAGO">Pago</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Monto</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0"
            step="1.00"
            min="0"
            {...register("amount", {
              required: "El monto es requerido",
              valueAsNumber: true,
              min: { value: 0, message: "El monto debe ser mayor a 0" },
            })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción (opcional)</Label>
          <Input
            id="description"
            placeholder="Ej: Detergente, Arroz..."
            {...register("description")}
          />
        </div>

        <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar Movimiento"}
        </Button>
      </form>
    </div>
  );
}
