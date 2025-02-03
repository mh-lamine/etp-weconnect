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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const ModalAddService = ({ providerCategoryId, createService }) => {
  const [open, setOpen] = useState(false);
  const [service, setService] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const isDesktop = useMediaQuery("(min-width: 768px)");

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
    if (!service?.name || !service?.price || !service?.duration) {
      toast.error("Veuillez renseigner tous les champs obligatoires.");
      setError("border-destructive");
      setTimeout(() => setError(null), 4500);
      return;
    }

    if (service.paymentOption === "DEPOSIT" && !service.deposit) {
      toast.error("Veuillez renseigner l'acompte.");
      setLoading(false);
      return;
    }

    if (service.deposit > service.price) {
      toast.error(
        "Le montant de l'acompte ne peut pas être supérieur au prix."
      );
      return;
    }

    setLoading(true);
    try {
      await createService({ providerCategoryId, ...service });
      setOpen(false);
    } catch (error) {
      toast.error("Une erreur est survenue, veuillez contacter le support.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!open) {
      setService();
    }
  }, [open]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Ajouter une prestation</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter une prestation</DialogTitle>
            <DialogDescription>
              Définissez un nom, un prix et une durée pour ajouter une
              prestation.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                name="name"
                type="text"
                onChange={handleChange}
                className={error}
              />
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <Label htmlFor="price">Prix</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    onChange={handleChange}
                    className={error}
                  />
                  <span>€</span>
                </div>
              </div>
              <div>
                <Label>Option</Label>
                <Select
                  onValueChange={(value) =>
                    setService({ ...service, paymentOption: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="ON_SITE">Sur place</SelectItem>
                      <SelectItem value="DEPOSIT">Acompte</SelectItem>
                      <SelectItem value="FULL">Complet</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="deposit">Acompte</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="deposit"
                    name="deposit"
                    type="number"
                    onChange={handleChange}
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
                className={error}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                className="resize-none"
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <div className="w-full flex items-center justify-between">
                <Button variant="outline" onClick={() => setService()}>
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
        <div className="flex flex-col px-4 gap-2">
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              name="name"
              type="text"
              onChange={handleChange}
              className={error}
            />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label htmlFor="price">Prix</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="price"
                  name="price"
                  type="number"
                  onChange={handleChange}
                  className={error}
                />
                <span>€</span>
              </div>
            </div>
            <div>
              <Label>Option</Label>
              <Select
                onValueChange={(value) =>
                  setService({ ...service, paymentOption: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ON_SITE">Sur place</SelectItem>
                    <SelectItem value="DEPOSIT">Acompte</SelectItem>
                    <SelectItem value="FULL">Complet</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="deposit">Acompte</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="deposit"
                  name="deposit"
                  type="number"
                  onChange={handleChange}
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
              className={error}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              className="resize-none"
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
                {loading ? <Loader2 className="animate-spin" /> : "Ajouter"}
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

export default ModalAddService;
