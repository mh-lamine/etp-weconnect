import axiosPrivate from "@/api/axiosPrivate";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SalonPayment() {
  const [loading, setLoading] = useState(false);

  const { auth } = useAuth();

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
              <Link to="/salon/payment">Paiements</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-semibold">Mes paiements</h1>
      <div className="flex items-center gap-4">
        <Input disabled value={auth.email} className="w-fit" />
        <Button onClick={startOnboarding} className="w-fit" disabled={loading}>
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
