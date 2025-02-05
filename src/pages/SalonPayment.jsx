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

export default function SalonPayment() {
  const [loading, setLoading] = useState(false);

  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [defaultDeposit, setDefaultDeposit] = useState(auth?.defaultDeposit);
  const [defaultPaymentOption, setDefaultPaymentOption] = useState(
    auth?.defaultPaymentOption
  );

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

  const handleSubmit = async (e) => {
    console.log("submitting");
  };

  const calculateDeposit = () => {
    const depositAmount = defaultDeposit || auth.defaultDeposit;
    return Math.round(50 * (depositAmount / 100));
  };

  return (
    <main className="w-full max-w-screen-md mx-auto p-6 flex flex-1 flex-col gap-4">
      <BreadcrumbTree />
      <h1 className="text-3xl font-semibold">Mes paiements</h1>
      {!auth.stripeConnectedAccountId ? (
        <>
          <div className="flex flex-wrap items-center gap-4">
            <Input disabled value={auth.email} className="w-fit" />
            <Button
              onClick={startOnboarding}
              className="w-fit"
              disabled={loading}
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
        </>
      ) : (
        <div>
          <div>
            <Label htmlFor="defaultDeposit">Acompte par défaut</Label>
            <div className="flex items-center gap-2 w-2/3">
              <Input
                id="defaultDeposit"
                type="number"
                defaultValue={auth.defaultDeposit}
                onChange={(e) => setDefaultDeposit(e.target.value)}
                className="w-fit"
              />
              <span>%</span>
            </div>
            <p className="text-muted text-sm">
              L'acompte par défaut sera utilisé pour les prestations qui n'ont
              pas d'acompte spécifique configuré. <br /> <br />
              <span className="font-semibold">Exemple:</span> Pour une
              prestation à{" "}
              <span className="font-semibold text-primary">50€</span> avec{" "}
              <span className="font-semibold text-primary">
                {defaultDeposit}%
              </span>{" "}
              d'acompte, le client devra payer{" "}
              <span className="font-semibold text-primary">
                {calculateDeposit(defaultDeposit)}€
              </span>{" "}
              à la réservation.
            </p>
          </div>
          <div>
            <Label className="mt-4">
              Paiement par défault
            </Label>
            <Select
              id="defaultPaymentOption"
              onValueChange={(value) => setDefaultPaymentOption(value)}
              defaultValue={auth.defaultPaymentOption}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={auth.defaultPaymentOption} />
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
              prestations qui n'ont pas d'option de paiement spécifique
              configuré. <br /> <br />
            </p>
            {defaultPaymentOption === "ON_SITE" && (
              <p className="text-muted text-sm">
                <span className="font-semibold text-primary">Sur place</span> :
                Aucun paiement ne sera demandé au client lors de la réservation.
              </p>
            )}
            {defaultPaymentOption === "DEPOSIT" && (
              <p className="text-muted text-sm">
                <span className="font-semibold text-primary">Acompte</span> : Un
                acompte sera demandé au client lors de la réservation.
              </p>
            )}
            {defaultPaymentOption === "FULL" && (
              <p className="text-muted text-sm">
                <span className="font-semibold text-primary">Complet</span> : Le
                client devra payer la totalité de la prestation lors de la
                réservation.
              </p>
            )}
          </div>
        </div>
      )}
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
