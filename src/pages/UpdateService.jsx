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
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function UpdateService() {
  const { serviceId } = useParams();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const [service, setService] = useState();
  const [formData, setFormData] = useState();
  const [loading, setLoading] = useState({
    SPLASH_SCREEN: true,
    SUBMIT_BUTTON: false,
  });
  const [error, setError] = useState({
    REQUIRED_FIELDS: false,
    API_CALL: false,
  });
  const [showActions, setShowActions] = useState(false);

  const getService = async () => {
    try {
      const { data } = await axios.get(`/api/providerService/${serviceId}`);
      setService(data);
      setFormData(data);
    } catch (err) {
      console.error(err);
      setError({ ...error, API_CALL: true });
    } finally {
      setLoading({
        ...loading,
        SPLASH_SCREEN: false,
      });
    }
  };

  const calculateDeposit = (fullPrice) => {
    return Math.round(fullPrice * (auth.defaultDeposit / 100));
  };

  const setDefaultPaymentSettings = () => {
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
    setShowActions(true);
  };

  const formatTime = (minutes) => {
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
    if (formData === service) {
      toast("Aucune modification n'a été apportée");
      return;
    }

    if (formData.deposit > formData.price) {
      toast.error("L'acompte ne peut pas être supérieur au prix total");
      return;
    }

    if (!formData.name || !formData.price || !formData.duration) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      setError({ ...error, REQUIRED_FIELDS: true });
      setTimeout(() => {
        setError({ ...error, REQUIRED_FIELDS: false });
      }, 3000);
      return;
    }

    try {
      setLoading({
        ...loading,
        SUBMIT_BUTTON: true,
      });
      await axiosPrivate.put(`/api/providerService/${serviceId}`, formData);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading({
        ...loading,
        SUBMIT_BUTTON: false,
      });
      setShowActions(false);
    }
  };

  const resetForm = () => {
    setFormData(service);
    setShowActions(false);
  };

  useEffect(() => {
    getService();
  }, [serviceId]);

  if (loading.SPLASH_SCREEN) {
    return <div>Loading...</div>;
  }

  if (error.API_CALL) {
    return <div>Une erreur s'est produite</div>;
  }

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
              <Link to={`/salon/services/${service.name}`}>{service.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div>
        <h1 className="text-3xl font-semibold">{service.name}</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input
              name="name"
              type="text"
              value={formData.name}
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
                value={formData.price}
                onChange={handleChange}
                className={
                  error.REQUIRED_FIELDS && "border-destructive animate-pulse"
                }
              />
            </div>
          </div>
          <div className="px-4 my-2 space-y-2 rounded-md border-l-2 border-muted/25">
            <div className="max-w-sm">
              <Label>Option</Label>
              <Select
                value={formData.paymentOption}
                onValueChange={(value) => {
                  return (
                    setFormData({ ...formData, paymentOption: value }),
                    setShowActions(true)
                  );
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
                  value={formData.deposit}
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
          <div>
            <Label htmlFor="duration">Durée (heures:minutes)</Label>
            <Input
              name="duration"
              type="time"
              value={formatTime(formData.duration)}
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
              value={formData.description || ""}
              onChange={handleChange}
            />
          </div>
          {showActions && (
            <div className="flex gap-2">
              <Button type="submit" disabled={loading.SUBMIT_BUTTON}>
                {loading.SUBMIT_BUTTON ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Enregistrer"
                )}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Annuler
              </Button>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
