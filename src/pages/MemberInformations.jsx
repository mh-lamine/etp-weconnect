import axiosPrivate from "@/api/axiosPrivate";
import EditableInput from "@/components/EditableInput";
import ModalAction from "@/components/modal/ModalAction";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function MemberInformations() {
  const [member, setMember] = useState(null);
  const [memberInfos, setMemberInfos] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getMember();
  }, []);

  async function getMember() {
    try {
      const { data } = await axiosPrivate.get(`/api/salon/members/${id}`);
      setMember(data);
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
    setLoading(true);
    try {
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
                {member?.firstName} {member?.lastName}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-semibold">
        {member?.firstName} {member?.lastName}
      </h1>
      <p className="text-muted">Gérez les informations du membre.</p>
      <form className="space-y-4">
        <div className="space-y-2 md:space-y-0 md:grid grid-cols-2 md:gap-4">
          <EditableInput
            id="firstName"
            label="Prénom"
            type="text"
            defaultValue={member?.firstName}
            handleChange={handleChange}
          />
          <EditableInput
            id="lastName"
            label="Nom"
            type="text"
            defaultValue={member?.lastName}
            handleChange={handleChange}
          />
          <EditableInput
            id="accessCode"
            label="Code d'accès"
            type="text"
            defaultValue={member?.accessCode}
            disabled={true}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Enregistrer les modifications"
            )}
          </Button>
          <Button
            variant="outline"
            type="reset"
            onClick={() => {
              setMemberInfos();
              setshowActionButtons(false);
            }}
          >
            Annuler
          </Button>
        </div>
      </form>

      <div className="mt-auto">
        <ModalAction
          id={member?.id}
          action={removeMember}
          actionLabel="Retirer le membre"
          variant="destructive"
          title="Retirer du salon"
          description="Le membre sera retiré du salon et ne pourra plus accéder à l'application."
          trigger="Retirer le membre"
          triggerVariant="destructive"
          successMessage={`${member?.firstName} ${member?.lastName} a été retiré du salon.`}
        />
      </div>
    </main>
  );
}
