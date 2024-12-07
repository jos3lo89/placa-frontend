import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const searchSchema = z.object({
  placa: z
    .string()
    .regex(/^[A-Z]{2}\d{3}$/, "La placa debe tener el formato TE294"),
});
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CalendarIcon } from "lucide-react";

interface VehicleSearch {
  id: string;
  id_placa: string;
  fecha_busqueda: string;
  tipo: string;
  placa: {
    id: string;
    N_Placa: string;
    N_Serie: string;
    N_VIN: string;
    N_Motor: string;
    Color: string;
    Marca: string;
    Modelo: string;
    Placa_Vigente: string;
    Placa_Anterior: string;
    Estado: string;
    Anotaciones: string;
    Sede: string;
  };
}

type SearchFormValues = z.infer<typeof searchSchema>;

interface VehicleData {
  id: string;
  N_Placa: string;
  N_Serie: string;
  N_VIN: string;
  N_Motor: string;
  Color: string;
  Marca: string;
  Modelo: string;
  Placa_Vigente: string;
  Placa_Anterior: string;
  Estado: string;
  Anotaciones: string;
  Sede: string;
  Propietarios: Array<{
    id: string;
    nombre: string;
    apellido: string;
    id_placa: string;
  }>;
}

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicleSearches, setVehicleSearches] = useState<VehicleSearch[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
  });

  const placa = watch("placa");

  // useEffect(() => {
  //   if (placa && placa.length === 5) {
  //     handleSubmit(onSubmit)({ placa: placa }); // Pasa placa de la forma correcta
  //   }
  // }, [placa]);

  const onSubmit = async (data: SearchFormValues) => {
    try {
      const res = await axios.get(`/placa-entrada/${data.placa}`);
      console.log(res.data);
      setVehicleData(res.data);
      setIsModalOpen(true);

      if (date) {
        fetchVehicleSearches(date);
      }
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    }
  };

  const fetchVehicleSearches = async (selectedDate: Date) => {
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const res = await axios.get(`/search-history/entrada/${formattedDate}`);
      console.log("--------------", res.data);

      setVehicleSearches(res.data);
    } catch (error) {
      console.error("Error al obtener el historial de búsqueda:", error);
    }
  };

  useEffect(() => {
    if (date) {
      fetchVehicleSearches(date);
    }
  }, [date]);

  const filteredSearches = vehicleSearches.filter((search) =>
    search.placa.N_Placa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSearches.length / itemsPerPage);
  const paginatedSearches = filteredSearches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="mt-6 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-3xl font-bold text-center">
            Búsqueda de Vehículos
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="placa">Número de Placa</Label>
              <Input
                id="placa"
                {...register("placa")}
                placeholder="Ej: TE294"
                className="w-full"
              />
              {errors.placa && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.placa.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Buscar
            </Button>
          </form>

          {placa && placa.length === 5 && (
            <p className="text-sm text-gray-500 mt-2">
              Placa ingresada: {placa}
            </p>
          )}

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Información del Vehículo</DialogTitle>
                <DialogDescription>
                  Detalles del vehículo con placa {vehicleData?.N_Placa}
                </DialogDescription>
              </DialogHeader>
              {vehicleData && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="marca" className="text-right">
                      Marca
                    </Label>
                    <Input
                      disabled={true}
                      id="marca"
                      value={vehicleData.Marca}
                      className="col-span-3"
                      readOnly
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="modelo" className="text-right">
                      Modelo
                    </Label>
                    <Input
                      disabled={true}
                      id="modelo"
                      value={vehicleData.Modelo}
                      className="col-span-3"
                      readOnly
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="color" className="text-right">
                      Color
                    </Label>
                    <Input
                      disabled={true}
                      id="color"
                      value={vehicleData.Color}
                      className="col-span-3"
                      readOnly
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="estado" className="text-right">
                      Estado
                    </Label>
                    <Input
                      disabled={true}
                      id="estado"
                      value={vehicleData.Estado}
                      className="col-span-3"
                      readOnly
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="propietario" className="text-right">
                      Propietario
                    </Label>

                    {vehicleData.Propietarios &&
                      vehicleData.Propietarios.map((v, i) => (
                        <Input
                          key={i}
                          disabled={true}
                          id={`${v.nombre}-${i}`}
                          className="col-span-3"
                          value={`${v.nombre} ${v.apellido}`}
                          readOnly
                        ></Input>
                      ))}
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => setIsModalOpen(false)}>Cerrar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className="flex flex-col gap-4 justify-between items-center mb-6 space-y-4 md:space-y-0">
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative inline-flex items-center justify-center p-2 text-sm font-medium text-gray-900 rounded-md bg-white border border-gray-300 hover:bg-gray-50">
                <CalendarIcon className="h-5 w-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="">
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </PopoverContent>
          </Popover>
          <Input
            type="text"
            placeholder="Buscar por número de placa"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número de Placa</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Fecha de Búsqueda</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSearches.map((search) => (
              <TableRow key={search.id}>
                <TableCell>{search.placa.N_Placa}</TableCell>
                <TableCell>{search.placa.Marca}</TableCell>
                <TableCell>{search.placa.Modelo}</TableCell>
                <TableCell>{search.placa.Color}</TableCell>
                <TableCell>{search.placa.Estado}</TableCell>
                <TableCell>{search.tipo.toUpperCase()}</TableCell>
                <TableCell>
                  {format(
                    new Date(search.fecha_busqueda),
                    "dd/MM/yyyy HH:mm:ss"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => setCurrentPage(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};
export default HomePage;
