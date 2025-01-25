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
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { convertToMinutes } from "@/utils/formatting";
import { toast } from "sonner";

const ModalUpdateService = ({ prevService, updateService }) => {
  const [open, setOpen] = useState(false);
  const [service, setService] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const formatTime = (minutes) => {
    // Calculate hours and remaining minutes
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    // Format the output with leading zeros
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(remainingMinutes).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const parsedValue =
      name === "price" || name === "deposit"
        ? parseFloat(value)
        : name === "duration"
        ? parseFloat(convertToMinutes(value))
        : value;

    setService({ ...service, [name]: parsedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!service?.name || !service?.price || !service?.duration) {
      toast.error("Veuillez renseigner tous les champs obligatoires.");
      setError("border-destructive");
      setTimeout(() => setError(null), 4500);
      setLoading(false);
      return;
    }

    const hasChanges = Object.keys(service).some(
      (key) => service[key] !== prevService[key]
    );

    if (!hasChanges) {
      setLoading(false);
      setOpen(false);
      return;
    }

    try {
      await updateService(prevService.id, service);
      setOpen(false);
    } catch (error) {
      setError("Une erreur est survenue, veuillez contacter le support.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const { name, price, duration, description } = prevService;
    if (!open) {
      setService({
        name,
        price,
        duration,
        description,
      });
    }
  }, [open]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Modifier la prestation</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier la prestation</DialogTitle>
            <DialogDescription>
              Modifiez les détails de la prestation.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                name="name"
                type="text"
                defaultValue={prevService.name}
                onChange={handleChange}
                className={error}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="price">Prix</Label>
                <div className="flex items-center gap-2 w-2/3">
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    onChange={handleChange}
                    defaultValue={prevService.price}
                    className={error}
                  />
                  <span>€</span>
                </div>
              </div>
              <div>
                <Label htmlFor="deposit">Acompte</Label>
                <div className="flex items-center gap-2 w-2/3">
                  <Input
                    id="deposit"
                    name="deposit"
                    type="number"
                    onChange={handleChange}
                    defaultValue={prevService.deposit}
                  />
                  <span>€</span>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="duration">Durée (heures:minutes)</Label>
              <Input
                id="duration"
                name="duration"
                type="time"
                defaultValue={formatTime(prevService.duration)}
                onChange={handleChange}
                className={error}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                className="resize-none"
                defaultValue={prevService.description}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <div className="w-full flex items-center justify-between">
                <Button onClick={handleSubmit} disabled={loading && true}>
                  {loading ? <Loader2 className="animate-spin" /> : "Modifier"}
                </Button>
                <Button variant="outline" onClick={() => setService()}>
                  Annuler
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
        <Button variant="outline">Modifier la prestation</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle> Modifier la prestation</DrawerTitle>
          <DrawerDescription>
            Modifiez les détails de la prestation.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col px-4 gap-2">
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              name="name"
              type="text"
              defaultValue={prevService.name}
              onChange={handleChange}
              className={error}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="price">Prix</Label>
              <div className="flex items-center gap-2 w-2/3">
                <Input
                  id="price"
                  name="price"
                  type="number"
                  onChange={handleChange}
                  defaultValue={prevService.price}
                  className={error}
                />
                <span>€</span>
              </div>
            </div>
            <div>
              <Label htmlFor="deposit">Acompte</Label>
              <div className="flex items-center gap-2 w-2/3">
                <Input
                  id="deposit"
                  name="deposit"
                  type="number"
                  onChange={handleChange}
                  defaultValue={prevService.deposit}
                />
                <span>€</span>
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="duration">Durée (heures:minutes)</Label>
            <Input
              id="duration"
              name="duration"
              type="time"
              onChange={handleChange}
              defaultValue={formatTime(prevService.duration)}
              className={error}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              className="resize-none"
              defaultValue={prevService.description}
              onChange={handleChange}
            />
          </div>
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={loading && true}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Modifier"}
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setService()}
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

export default ModalUpdateService;
