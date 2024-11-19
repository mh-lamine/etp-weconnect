import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";

const ModalAssignServices = ({ categories, assignServices, member }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const [services, setServices] = useState();
  const [loading, setLoading] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { firstName, lastName } = member;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!services.length) {
      toast.error("Veuillez sélectionner des prestations.");
      return;
    }

    setLoading(true);
    try {
      await assignServices(services);
      setValue();
      setOpen(false);
    } catch (error) {
      toast.error("Une erreur est survenue, veuillez contacter le support.");
    }
    setLoading(false);
  };

  useEffect(() => {
    setServices(member.services.map((service) => service.id));
  }, [open]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="link" className="py-0">
            Assigner des prestations
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Assigner des prestations à {firstName} {lastName}
            </DialogTitle>
            <DialogDescription>
              Sélectionnez une catégorie et ajoutez des prestations pour votre
              membre.
            </DialogDescription>
          </DialogHeader>
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2">
            {value &&
              categories
                .find((category) => category.id === value)
                .services.map((service) => (
                  <Button
                    key={service.id}
                    className="w-fit"
                    variant={
                      services.find(
                        (selectedService) => selectedService === service.id
                      )
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      setServices((prev) =>
                        prev.includes(service.id)
                          ? prev.filter((id) => id !== service.id)
                          : [...prev, service.id]
                      )
                    }
                  >
                    {service.name}
                  </Button>
                ))}
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <div className="w-full flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setServices(member.services.map((service) => service.id));
                    setValue();
                  }}
                >
                  Annuler
                </Button>
                <Button onClick={handleSubmit} disabled={loading && true}>
                  {loading ? <Loader2 className="animate-spin" /> : "Ajouter"}
                </Button>
              </div>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Ajouter une prestation</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Ajouter une prestation</DrawerTitle>
          <DrawerDescription>
            Définissez un nom, un prix et une durée pour ajouter une prestation.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col px-4 gap-2"></div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={loading && true}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Ajouter"}
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  setServices(member.services.map((service) => service.id));
                  setValue();
                }}
              >
                Annuler
              </Button>
            </div>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ModalAssignServices;
