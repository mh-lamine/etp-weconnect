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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { toast } from "sonner";

const ModalAddMember = ({ addMember }) => {
  const [open, setOpen] = useState(false);
  const [member, setMember] = useState();
  const [loading, setLoading] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const generateAccessCode = () => {
    const min = 100000;
    const max = 999999;

    // Use crypto to generate a secure random number
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);

    // Make sure the random value is between the desired range
    let code = Math.floor(
      min + (array[0] / (0xffffffff + 1)) * (max - min + 1)
    );
    // setAccessCode(String(code));
    setMember((prev) => {
      return { ...prev, accessCode: String(code) };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!member?.firstName || !member?.lastName || !member?.accessCode) {
      toast.error("Veuillez renseigner tous les champs.");
      return;
    }

    setLoading(true);
    try {
      await addMember(member);
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Une erreur est survenue, veuillez contacter le support.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!open) {
      setMember();
    }
  }, [open]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="link" className="py-0">
            Ajouter un membre
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un membre</DialogTitle>
            <DialogDescription>
              Entrez les informations du nouveau membre.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <div>
              <Label htmlFor="name">Prénom</Label>
              <Input
                name="firstName"
                type="text"
                placeholder="Jean"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                name="lastName"
                type="text"
                placeholder="Dupont"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="name">Code d'accès</Label>
              <div className="flex justify-between">
                <InputOTP
                  maxLength={6}
                  value={member?.accessCode || null}
                  onChange={(value) => setMember({ ...member, accessCode: value })}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <Button variant="ghost" onClick={generateAccessCode}>
                  Générer
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <div className="w-full flex items-center justify-between">
                <Button variant="outline" onClick={() => setMember()}>
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
        <Button variant="link" className="py-0">
          Ajouter un membre
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Ajouter un membre</DrawerTitle>
          <DrawerDescription>
            Entrez les informations du nouveau membre.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col px-4 gap-2">
          <div>
            <Label htmlFor="name">Prénom</Label>
            <Input
              name="firstName"
              type="text"
              placeholder="Jean"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input
              name="lastName"
              type="text"
              placeholder="Dupont"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="name">Code d'accès</Label>
            <div className="flex justify-between">
              <InputOTP
                maxLength={6}
                value={member?.accessCode || null}
                onChange={(value) => setMember({ ...member, accessCode: value })}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button variant="ghost" onClick={generateAccessCode}>
                Générer
              </Button>
            </div>
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
                onClick={() => setMember()}
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

export default ModalAddMember;
