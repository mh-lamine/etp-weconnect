import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";

const ModalClientInfo = ({ client }) => {
  const [open, setOpen] = useState(false);

  const { firstName, lastName, phoneNumber } = client;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline">
            Voir la fiche client
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-primary">
              Fiche client de {firstName} {lastName}
            </DialogTitle>
          </DialogHeader>
          <ul>
            <li>
              <b>Numéro de téléphone:</b> {phoneNumber}
            </li>
          </ul>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="w-full" variant="outline">
          Voir la fiche client
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-primary">
            Voir la fiche client de {firstName} {lastName}
          </DrawerTitle>
        </DrawerHeader>
        <ul>
          <li>
            <b>Numéro de téléphone:</b> {phoneNumber}
          </li>
        </ul>
      </DrawerContent>
    </Drawer>
  );
};

export default ModalClientInfo;
