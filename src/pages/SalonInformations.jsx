import EditableInput from "@/components/EditableInput";
import Error from "@/components/Error";
import ProviderHeader from "@/components/ProviderHeader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PHONE_NUMBER_REGEX =
  /^(?:(?:\+|00)33\s?[1-9](?:[\s.-]?\d{2}){4}|0[1-9](?:[\s.-]?\d{2}){4})$/;

const EMAIL_REGEX =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const validFileTypes = ["image/jpeg", "image/jpg", "image/png"];

export default function SalonInformations() {
  const { auth } = useAuth();

  const [prevInfos, setPrevInfos] = useState(auth);
  const [salonInfos, setSalonInfos] = useState({
    name: auth.name,
    address: auth.address,
    email: auth.email,
    phoneNumber: auth.phoneNumber,
    bookingTerms: auth.bookingTerms,
    autoAcceptAppointments: auth.autoAcceptAppointments,
    isInVacancyMode: auth.isInVacancyMode,
    profilePicture: auth.profilePicture,
    coverImage: auth.coverImage,
  });

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  async function getSalon() {
    try {
      const { data } = await axiosPrivate.get("/api/salon");
      setPrevInfos(data);
      return data;
    } catch (error) {
      setError(error);
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
  }

  const rmprofile = async () => {
    try {
      await axiosPrivate.delete("/api/s3/profile", {
        profilePicture: null,
      });
      await getSalon();
    } catch (error) {
      console.log(error);
    }
  };

  const rmcover = async () => {
    try {
      await axiosPrivate.delete("/api/s3/cover", {
        coverImage: null,
      });
      await getSalon();
    } catch (error) {
      console.log(error);
    }
  };

  const resetSalonInfos = () => {
    setSalonInfos({
      name: auth.name,
      address: auth.address,
      email: auth.email,
      phoneNumber: auth.phoneNumber,
      bookingTerms: auth.bookingTerms,
      autoAcceptAppointments: auth.autoAcceptAppointments,
      isInVacancyMode: auth.isInVacancyMode,
      profilePicture: auth.profilePicture,
      coverImage: auth.coverImage,
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSalonInfos({ ...salonInfos, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, phoneNumber } = salonInfos;
    if (!name || !email || !phoneNumber) {
      setLoading(false);
      toast.error("Veuillez renseigner tous les champs obligatoires");
      return;
    }

    const hasChanges = Object.keys(salonInfos).some(
      (key) => salonInfos[key] !== prevInfos[key]
    );

    if (!hasChanges) {
      setLoading(false);
      toast("Aucune modification n'a été effectuée");
      return;
    }

    if (email && !EMAIL_REGEX.test(email)) {
      toast.error("L'adresse email n'est pas valide");
      setLoading(false);
      return;
    }

    if (phoneNumber && !PHONE_NUMBER_REGEX.test(phoneNumber)) {
      toast.error("Le numéro de téléphone n'est pas valide");
      setLoading(false);
      return;
    }

    // Optimistically update the UI before making the API call
    const updatedInfos = { ...salonInfos };
    setSalonInfos(updatedInfos); // Immediately update the state to reflect changes

    try {
      await axiosPrivate.patch("/api/salon", { ...salonInfos });
      await getSalon();
      toast("Modifications enregistrées");
    } catch (error) {
      resetSalonInfos();
      toast.error("Une erreur est survenue, veuillez contacter le support");
    }
    setLoading(false);
  };

  const handleUpload = async (e) => {
    const { id, files } = e.target;

    if (!validFileTypes.includes(files[0].type)) {
      toast.error("Le format du fichier n'est pas valide");
    }

    const formData = new FormData();
    formData.append(id, files[0]);

    try {
      await axiosPrivate.post(`/api/s3/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      getSalon();
      toast.success("Photo de profil mise à jour avec succès");
    } catch (error) {
      if (error.response.status === 413) {
        toast.error("Le fichier est trop volumineux");
      } else {
        console.error(error.response.data.message);
        toast.error("Une erreur est survenue, veuillez contacter le support");
      }
    }
  };

  if (error) {
    return <Error errMsg={error} />;
  }

  return (
    <main className="w-full max-w-screen-md mx-auto p-6 flex flex-1 flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Tableau de bord</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/salon">Salon</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/salon/informations">Informations</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-semibold">Mes informations</h1>
      <ProviderHeader
        name={salonInfos.name}
        address={salonInfos.address}
        profilePicture={salonInfos.profilePicture}
        coverImage={salonInfos.coverImage}
        rmprofile={rmprofile}
        rmcover={rmcover}
      />
      <div className="space-y-2 md:space-y-0 md:grid grid-cols-2 md:gap-4">
        <Button asChild>
          <Label htmlFor="profile" className=" w-full">
            Changer ma photo de profil
          </Label>
        </Button>
        <Input
          className="hidden"
          type="file"
          id="profile"
          onChange={handleUpload}
        />
        <Button asChild>
          <Label htmlFor="cover" className=" w-full">
            Changer ma photo de couverture
          </Label>
        </Button>
        <Input
          className="hidden"
          type="file"
          id="cover"
          onChange={handleUpload}
        />
      </div>
      <form className="space-y-2">
        <div className="space-y-2 md:space-y-0 md:grid grid-cols-2 md:gap-4">
          <EditableInput
            id="name"
            label="Nom du salon"
            type="text"
            defaultValue={salonInfos.name}
            handleChange={handleChange}
          />
          <EditableInput
            id="address"
            label="Adresse"
            type="text"
            defaultValue={salonInfos.address}
            handleChange={handleChange}
          />
          <EditableInput
            id="phoneNumber"
            label="Téléphone du salon"
            type="tel"
            defaultValue={salonInfos.phoneNumber}
            handleChange={handleChange}
          />
          <EditableInput
            id="email"
            label="Email"
            type="email"
            defaultValue={salonInfos.email}
            handleChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="autoAccept">Confirmation automatique</Label>
          <div className="bg-white rounded-md px-3 py-2 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <p>
                Choisissez ou non d'accepter automatiquement les demandes de
                rendez-vous.
              </p>
              <Switch
                id="autoAccept"
                checked={
                  salonInfos?.autoAcceptAppointments
                }
                onCheckedChange={(checked) => {
                  setSalonInfos({
                    ...salonInfos,
                    autoAcceptAppointments: checked,
                  });
                }}
              />
            </div>
            <p className={"text-muted"}>
              Si vous choisissez de ne pas accepter automatiquement les demandes
              de rendez-vous, elles auront le status <b>En attente</b> tant que
              vous ne les aurez pas confirmées ou refusées.
            </p>
          </div>
        </div>
        <div>
          <Label htmlFor="vacancyMode" className="text-destructive">
            Mode vacances
          </Label>
          <div className="bg-white rounded-md px-3 py-2 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <p>
                Passez en mode vacances pour ne plus recevoir de demandes de
                rendez-vous.
              </p>
              <Switch
                id="vacancyMode"
                checked={
                  salonInfos?.isInVacancyMode
                }
                onCheckedChange={(checked) => {
                  setSalonInfos({
                    ...salonInfos,
                    isInVacancyMode: checked,
                  });
                }}
                className="data-[state=checked]:bg-destructive"
              />
            </div>
            <p className="text-muted">
              En cas de fermerture temporaire de votre salon, vous pouvez
              activer le mode vacances pour ne plus recevoir de demandes de
              rendez-vous pendant un certain temps.
            </p>
          </div>
        </div>
        <div className="col-span-2">
          <Label htmlFor="terms">Conditions de réservation</Label>
          <Textarea
            id="bookingTerms"
            type="text"
            defaultValue={salonInfos.bookingTerms}
            onChange={handleChange}
            className="text-lg whitespace-pre-line"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSubmit} disabled={loading}>
            Enregistrer les modifications
          </Button>
          <Button variant="outline" type="reset" onClick={resetSalonInfos}>
            Annuler
          </Button>
        </div>
      </form>
    </main>
  );
}
