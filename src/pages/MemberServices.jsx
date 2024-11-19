import ModalAction from "@/components/modal/ModalAction";
import ModalAssignServices from "@/components/modal/ModalAssignServices";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { MinusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function MemberServices() {
  const [member, setMember] = useState();
  const [categories, setCategories] = useState();
  const [pageLoading, setPageLoading] = useState(true);

  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();

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

  async function getServices() {
    try {
      const { data } = await axiosPrivate.get("/api/providerCategory/me");
      setCategories(data);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
  }

  async function assignServices(data) {
    try {
      await axiosPrivate.patch(`/api/salon/members/${id}/assign`, data);
      getMember();
    } catch {
      console.error(error);
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
  }

  async function unassignService(id) {
    assignServices(
      member.services
        .map((service) => service.id)
        .filter((serviceId) => serviceId !== id)
    );
  }

  useEffect(() => {
    async function init() {
      await getMember();
      await getServices();
      setPageLoading(false);
    }
    init();
  }, []);

  if (pageLoading) {
    return <div>Loading...</div>;
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
              <Link to="/salon/members">Membres</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/salon/members/${id}/services`}>Prestations</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div>
        <h1 className="text-3xl font-semibold">
          {member.firstName} {member.lastName}
        </h1>
        <ModalAssignServices
          categories={categories}
          assignServices={assignServices}
          member={member}
        />
      </div>
      {member.services.length ? (
        <ul className="space-y-2">
          {member.services.map((service, i) => (
            <>
              <li
                key={service.id}
                className="flex items-center justify-between"
              >
                <p>{service.name}</p>
                <ModalAction
                  key={service.id}
                  id={service.id}
                  action={unassignService}
                  actionLabel="Retirer"
                  title="Retirer prestation"
                  description="Retirer cette prestation au membre."
                  successMessage="Prestation retirée avec succès."
                  trigger={<MinusCircle className="text-destructive" />}
                  variant="destructive"
                  triggerVariant="outline"
                />
              </li>
              {i !== member.services.length - 1 && (
                <div className="divider" key={i}></div>
              )}
            </>
          ))}
        </ul>
      ) : (
        <p className="text-muted">Ce membre n'a pas de prestations.</p>
      )}
    </main>
  );
}
