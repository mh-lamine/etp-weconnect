import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function SalonPayment() {
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const { auth, setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [formData, setFormData] = useState({
    defaultDeposit: auth?.defaultDeposit,
    defaultPaymentOption: auth?.defaultPaymentOption,
  });
  const [showActions, setShowActions] = useState(false);

  const startOnboarding = async () => {
    try {
      setLoading(true);
      const { data: onboardingLink } = await axiosPrivate.post(
        "/api/stripe/startOnboarding"
      );
      window.open(onboardingLink);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? +value : value,
    });
    setShowActions(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitLoading(true);
      await axiosPrivate.patch("/api/salon", formData);
      setAuth({ ...auth, ...formData });
      toast.success("Modifications enregistrées");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitLoading(false);
      setShowActions(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setFormData({
      defaultDeposit: auth.defaultDeposit,
      defaultPaymentOption: auth.defaultPaymentOption,
    });
    setShowActions(false);
  };

  const calculateDeposit = () => {
    return Math.round(50 * (formData.defaultDeposit / 100));
  };

  if (!auth.stripeConnectedAccountId) {
    return (
      <main className="w-full max-w-screen-md mx-auto p-6 flex flex-1 flex-col gap-4">
        <BreadcrumbTree />
        <h1 className="text-3xl font-semibold">Mes paiements</h1>
        <div className="flex flex-wrap items-center gap-4">
          <Input disabled value={auth.email} className="w-fit" />
          <Button
            onClick={startOnboarding}
            className="w-fit"
            disabled={loading || auth.stripeConnectedAccountId}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Créer un compte connecté"
            )}
          </Button>
        </div>
        <p className="text-muted text-sm">
          Créez un compte connecté avec l'email de votre salon pour mettre en
          place des paiements en ligne.
        </p>
      </main>
    );
  }

  return (
    <main className="w-full max-w-screen-md mx-auto p-6 flex flex-1 flex-col gap-4">
      <BreadcrumbTree />
      <h1 className="text-3xl font-semibold">Mes paiements</h1>
      <form className="space-y-4">
        <div>
          <Label>Paiement par défault</Label>
          <Select
            name="defaultPaymentOption"
            value={formData.defaultPaymentOption}
            onValueChange={(value) => {
              return (
                setFormData({ ...formData, defaultPaymentOption: value }),
                setShowActions(true)
              );
            }}
          >
            <SelectTrigger className="w-[180px]">
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
          <p className="text-muted text-sm">
            Cette option de paiement par défaut sera utilisé pour les
            prestations qui n'ont pas d'option de paiement spécifique configuré.{" "}
            <br /> <br />
          </p>
          {formData.defaultPaymentOption === "ON_SITE" && (
            <p className="text-muted text-sm">
              <span className="font-semibold text-primary">Sur place</span> :
              Aucun paiement ne sera demandé au client lors de la réservation.
            </p>
          )}
          {formData.defaultPaymentOption === "DEPOSIT" && (
            <p className="text-muted text-sm">
              <span className="font-semibold text-primary">Acompte</span> : Un
              acompte sera demandé au client lors de la réservation.
            </p>
          )}
          {formData.defaultPaymentOption === "FULL" && (
            <p className="text-muted text-sm">
              <span className="font-semibold text-primary">Complet</span> : Le
              client devra payer la totalité de la prestation lors de la
              réservation.
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="defaultDeposit">Acompte par défaut</Label>
          <div className="flex items-center gap-2 w-2/3">
            <Input
              name="defaultDeposit"
              type="number"
              value={formData.defaultDeposit}
              onChange={handleChange}
              className="w-fit"
            />
            <span>%</span>
          </div>
          <p className="text-muted text-sm">
            L'acompte par défaut sera utilisé pour les prestations qui n'ont pas
            d'acompte spécifique configuré. <br /> <br />
            <span className="font-semibold">Exemple:</span> Pour une prestation
            à <span className="font-semibold text-primary">50€</span> avec{" "}
            <span className="font-semibold text-primary">
              {formData.defaultDeposit}%
            </span>{" "}
            d'acompte, le client devra payer{" "}
            <span className="font-semibold text-primary">
              {calculateDeposit(formData.defaultDeposit)}€
            </span>{" "}
            à la réservation.
          </p>
        </div>

        {showActions && (
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={submitLoading}>
              {submitLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Enregstrer"
              )}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Annuler
            </Button>
          </div>
        )}
      </form>
    </main>
  );
}

const BreadcrumbTree = () => (
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
          <Link to="/salon/payment">Paiements</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);
