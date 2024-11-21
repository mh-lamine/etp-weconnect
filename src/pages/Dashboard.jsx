import ProviderAppointment from "@/components/ProviderAppointment";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useLogout from "@/hooks/useLogout";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/formatting";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [appointments, setAppointments] = useState();
  const [apiLoading, setApiLoading] = useState(true);
  const [members, setMembers] = useState();
  const [memberToSort, setMemberToSort] = useState();
  const logout = useLogout();

  const { auth } = useAuth();
  const isAdmin = auth?.role === "SALON";

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  async function getAppointmentsAsProvider() {
    const GET_URL = isAdmin
      ? "/api/appointments/provider"
      : "/api/appointments/member";

    try {
      const { data } = await axiosPrivate.get(GET_URL);
      setAppointments(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function acceptAppointment(id) {
    try {
      await axiosPrivate.patch(`/api/appointments/${id}`, {
        status: "ACCEPTED",
      });
      getAppointmentsAsProvider();
    } catch (error) {
      console.error(error);
    }
  }

  async function cancelAppointment(id) {
    try {
      await axiosPrivate.patch(`/api/appointments/${id}`, {
        status: "CANCELLED",
      });
      getAppointmentsAsProvider();
    } catch (error) {
      console.error(error);
    }
  }

  const filterAndSortAppointments = (appointments, status) => {
    return appointments
      .filter(
        (appointment) =>
          appointment.status === status &&
          (!memberToSort || appointment.memberId === memberToSort)
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    async function init() {
      try {
        const { data } = await axiosPrivate.get("/api/salon/members");
        setMembers(data);
      } catch (error) {
        console.error(error);
      }
      getAppointmentsAsProvider();
      setApiLoading(false);
    }
    init();
  }, []);

  const todaysAppointments = appointments?.todaysAppointments || [];
  const futureAppointments = appointments?.futureAppointments || [];

  if (apiLoading) {
    return <p>Chargement...</p>;
  }

  return (
    <main className="w-full h-full max-w-screen-md mx-auto p-6 flex flex-1 flex-col gap-4">
      <Breadcrumb className="h-0 p-0">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Tableau de bord</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Tabs defaultValue="today" className="space-y-4">
        <TabsContent value="today">
          <h1 className="text-3xl font-semibold">
            Mes rendez-vous de la journée
          </h1>
        </TabsContent>
        <TabsContent value="incoming">
          <h1 className="text-3xl font-semibold">Mes rendez-vous à venir</h1>
        </TabsContent>
        <div className="flex items-center gap-4">
          <TabsList>
            <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
            <TabsTrigger value="incoming">À venir</TabsTrigger>
          </TabsList>
          {isAdmin && (
            <Link to="/salon">
              <Settings size={24} className="text-primary" />
            </Link>
          )}
        </div>
        <TabsContent value="today" className="space-y-4">
          {isAdmin && (
            <div className="-space-x-4">
              {members?.map((member, i) => (
                <button
                  className={`z-[${i}]`}
                  onClick={
                    memberToSort == member.id
                      ? () => setMemberToSort(null)
                      : () => setMemberToSort(member.id)
                  }
                >
                  <Avatar
                    className={cn(
                      "w-12",
                      "h-12",
                      "border-2",
                      memberToSort == member.id
                        ? "border-primary"
                        : "border-white"
                    )}
                  >
                    <AvatarImage src={member.profilePicture} />
                    <AvatarFallback className="text-md">
                      {getInitials(member.firstName, member.lastName)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              ))}
            </div>
          )}
          {todaysAppointments.length ? (
            <>
              <p className="text-muted">
                Vous avez {todaysAppointments.length} rendez-vous aujourd'hui.
              </p>
              {filterAndSortAppointments(todaysAppointments, "ACCEPTED").map(
                (appointment) => (
                  <ProviderAppointment
                    key={appointment.id}
                    appointment={appointment}
                    cancelAppointment={cancelAppointment}
                    today={true}
                    isAdmin={isAdmin}
                  />
                )
              )}
              <div className="divider divider-start text-muted">
                Mes rendez-vous passés
              </div>
              {filterAndSortAppointments(todaysAppointments, "COMPLETED").map(
                (appointment) => (
                  <ProviderAppointment
                    key={appointment.id}
                    appointment={appointment}
                    past={true}
                    today={true}
                    isAdmin={isAdmin}
                  />
                )
              )}
            </>
          ) : (
            <p className="text-muted">
              {" "}
              Vous n'avez aucun rendez-vous aujourd'hui.
            </p>
          )}
        </TabsContent>
        <TabsContent value="incoming">
          {futureAppointments.length ? (
            <Accordion
              type="single"
              collapsible
              defaultValue={"item-0"}
              className="w-full space-y-4"
            >
              <AccordionItem value={`item-0`}>
                <AccordionTrigger>
                  <p className="text-muted">
                    Vous avez{" "}
                    {
                      appointments.futureAppointments.filter(
                        (appointment) => appointment.status === "PENDING"
                      ).length
                    }{" "}
                    demande(s) en attente.
                  </p>
                </AccordionTrigger>
                <AccordionContent>
                  {filterAndSortAppointments(futureAppointments, "PENDING").map(
                    (appointment) => (
                      <ProviderAppointment
                        key={appointment.id}
                        appointment={appointment}
                        acceptAppointment={acceptAppointment}
                        cancelAppointment={cancelAppointment}
                        isAdmin={isAdmin}
                      />
                    )
                  )}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value={`item-1`}>
                <AccordionTrigger>
                  <p className="text-muted">
                    Vous avez{" "}
                    {
                      appointments.futureAppointments.filter(
                        (appointment) => appointment.status === "ACCEPTED"
                      ).length
                    }{" "}
                    rendez-vous à venir.
                  </p>
                </AccordionTrigger>
                <AccordionContent>
                  {filterAndSortAppointments(
                    futureAppointments,
                    "ACCEPTED"
                  ).map((appointment) => (
                    <ProviderAppointment
                      key={appointment.id}
                      appointment={appointment}
                      acceptAppointment={acceptAppointment}
                      cancelAppointment={cancelAppointment}
                      isAdmin={isAdmin}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <p className="text-muted">Vous n'avez aucun rendez-vous à venir.</p>
          )}
        </TabsContent>
      </Tabs>
      <Button
        variant="destructive"
        onClick={handleLogout}
        className="w-fit mt-auto"
      >
        Se déconnecter
      </Button>
    </main>
  );
}
