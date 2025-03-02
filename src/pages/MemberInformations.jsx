import ModalAction from "@/components/modal/ModalAction";
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
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function MemberInformations() {
  const [prevMember, setPrevMember] = useState(null);
  const [memberInfos, setMemberInfos] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    getMember();
  }, []);

  async function getMember() {
    try {
      const { data } = await axiosPrivate.get(`/api/salon/members/${id}`);
      setPrevMember(data);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setMemberInfos((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!memberInfos) return;

    const hasChanges = Object.keys(memberInfos).some(
      (key) => memberInfos[key] !== prevMember[key]
    );

    if (!hasChanges) {
      setLoading(false);
      toast("Aucune modification n'a été effectuée");
      return;
    }

    try {
      setLoading(true);
      await axiosPrivate.patch(`/api/salon/members/${id}`, memberInfos);
      getMember();
      toast.success("Les informations du membre ont été mises à jour.");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (id) => {
    try {
      await axiosPrivate.delete(`/api/salon/members/${id}`);
      navigate("/salon/members");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="w-full h-full max-w-screen-md mx-auto p-6 flex flex-1 flex-col gap-4">
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
              <Link to="/salon/members">Membres</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/salon/members/${id}/informations`}>
                {prevMember?.firstName} {prevMember?.lastName}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-semibold">
        {prevMember?.firstName} {prevMember?.lastName}
      </h1>
      <p className="text-muted">Gérez les informations du membre.</p>
      <form
        className="space-y-4"
        onSubmit={handleSubmit}
        onReset={(e) => {
          e.target.reset();
          setMemberInfos(null);
        }}
      >
        <div className="space-y-2 md:space-y-0 md:grid grid-cols-2 md:gap-4">
          <div>
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              type="text"
              name="firstName"
              defaultValue={prevMember?.firstName}
              onChange={handleChange}
              className="text-lg"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              type="text"
              name="lastName"
              defaultValue={prevMember?.lastName}
              onChange={handleChange}
              className="text-lg"
            />
          </div>
          <div>
            <Label htmlFor="accessCode">Code d'accès</Label>
            <Input
              id="accessCode"
              type="text"
              name="accessCode"
              defaultValue={prevMember?.accessCode}
              onChange={handleChange}
              disabled={true}
              className="text-lg"
            />
          </div>
        </div>
        {memberInfos && (
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
            <Button variant="outline" type="reset">
              Annuler
            </Button>
          </div>
        )}
      </form>

      <div className="mt-auto">
        <ModalAction
          id={prevMember?.id}
          action={removeMember}
          actionLabel="Retirer le membre"
          variant="destructive"
          title="Retirer du salon"
          description="Le membre sera retiré du salon et ne pourra plus accéder à l'application."
          trigger="Retirer le membre"
          triggerVariant="destructive"
          successMessage={`${prevMember?.firstName} ${prevMember?.lastName} a été retiré du salon.`}
        />
      </div>
    </main>
  );
}
