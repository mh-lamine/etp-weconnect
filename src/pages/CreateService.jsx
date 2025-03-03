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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { convertToMinutes } from "@/utils/formatting";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function CreateService() {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [providerCategoryId, setProviderCategoryId] = useState();
  const [formData, setFormData] = useState();
  const [loading, setLoading] = useState({
    SUBMIT_BUTTON: false,
  });
  const [error, setError] = useState({
    REQUIRED_FIELDS: false,
    API_CALL: false,
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get("providerCategoryId")) {
      setProviderCategoryId(urlParams.get("providerCategoryId"));
    } else {
      navigate(-1);
    }
  }, []);

  const calculateDeposit = (fullPrice) => {
    return Math.round(fullPrice * (auth.defaultDeposit / 100));
  };

  const cancel = () => {
    navigate(-1);
  };

  const setDefaultPaymentSettings = () => {
    if (!formData?.price) {
      return toast.error("Veuillez renseigner un prix");
    }

    setFormData({
      ...formData,
      paymentOption: auth.defaultPaymentOption,
      deposit:
        auth.defaultPaymentOption === "DEPOSIT"
          ? calculateDeposit(formData.price)
          : 0,
    });
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "number"
          ? +value
          : type === "time"
          ? convertToMinutes(value)
          : value,
    });
  };

  const formatTime = (minutes) => {
    if (!minutes) return "00:00";

    // Calculate hours and remaining minutes
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    // Format the output with leading zeros
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(remainingMinutes).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData?.name || !formData?.price || !formData?.duration) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      setError({ ...error, REQUIRED_FIELDS: true });
      setTimeout(() => {
        setError({ ...error, REQUIRED_FIELDS: false });
      }, 3000);
      return;
    }

    if (formData.deposit && formData.deposit > formData.price) {
      toast.error("L'acompte ne peut pas être supérieur au prix total");
      return;
    }

    try {
      setLoading({
        ...loading,
        SUBMIT_BUTTON: true,
      });
      await axiosPrivate.post("/api/providerService", {
        ...formData,
        providerCategoryId,
      });
      toast.success("Prestation ajoutée avec succès");
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading({
        ...loading,
        SUBMIT_BUTTON: false,
      });
    }
  };

  return (
    <main className="w-full max-w-screen-md mx-auto p-6 flex flex-1 flex-col space-y-4">
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
              <Link to="/salon/services">Prestations</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={"/salon/services/create-service"}>
                Ajouter une prestation
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div>
        <h1 className="text-3xl font-semibold">Ajouter une prestation</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input
              name="name"
              type="text"
              value={formData?.name}
              onChange={handleChange}
              className={
                error.REQUIRED_FIELDS && "border-destructive animate-pulse"
              }
            />
          </div>
          <div className="max-w-sm">
            <Label htmlFor="price">Prix (en €)</Label>
            <div className="flex items-center gap-2">
              <Input
                name="price"
                type="number"
                value={formData?.price}
                onChange={handleChange}
                className={
                  error.REQUIRED_FIELDS && "border-destructive animate-pulse"
                }
              />
            </div>
          </div>
          {auth.stripeConnectedAccountId && (
            <div className="px-4 my-2 space-y-2 border-l-2 border-muted/25">
              <div className="max-w-sm">
                <Label>Paiement</Label>
                <Select
                  value={formData?.paymentOption}
                  onValueChange={(value) => {
                    setFormData({ ...formData, paymentOption: value });
                  }}
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
              <div className="max-w-sm">
                <Label htmlFor="deposit">Acompte (en €)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    name="deposit"
                    type="number"
                    disabled={formData?.paymentOption !== "DEPOSIT"}
                    value={formData?.deposit}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <Button
                type="button"
                onClick={setDefaultPaymentSettings}
                variant="link"
                className="whitespace-normal text-xs"
              >
                Appliquer les paramètres de paiement par défaut
              </Button>
            </div>
          )}
          <div>
            <Label htmlFor="duration">Durée (heures:minutes)</Label>
            <Input
              name="duration"
              type="time"
              value={formatTime(formData?.duration)}
              onChange={handleChange}
              className={
                error.REQUIRED_FIELDS && "border-destructive animate-pulse"
              }
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              className="resize-none"
              value={formData?.description || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading.SUBMIT_BUTTON}>
              {loading.SUBMIT_BUTTON ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Enregistrer"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={cancel}>
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
