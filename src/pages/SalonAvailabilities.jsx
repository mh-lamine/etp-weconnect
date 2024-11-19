import ModalAction from "@/components/modal/ModalAction";
import ModalAddAvailability from "@/components/modal/ModalAddAvailability";
import ModalAddSpecialAvailability from "@/components/modal/ModalAddSpecialAvailability";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Loader2, MinusCircle } from "lucide-react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

const SalonAvailabilities = () => {
  const daysOfWeek = {
    Lundi: "MONDAY",
    Mardi: "TUESDAY",
    Mercredi: "WEDNESDAY",
    Jeudi: "THURSDAY",
    Vendredi: "FRIDAY",
    Samedi: "SATURDAY",
    Dimanche: "SUNDAY",
  };

  const [availabilities, setAvailabilities] = useState();
  const [member, setMember] = useState();
  const [specialAvailabilities, setSpecialAvailabilities] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  useEffect(() => {
    if (id) getMember();
    getAvailabilities();
  }, []);

  async function getAvailabilities() {
    const GET_URL = id
      ? `/api/availabilities/member/${id}`
      : "/api/availabilities";
    try {
      const response = await axiosPrivate.get(GET_URL);
      setAvailabilities(formatAvailabilities(response.data.availabilities));
      setSpecialAvailabilities(response.data.specialAvailabilities);
    } catch (error) {
      setError(error);
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setLoading(false);
  }

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

  function formatDate(date) {
    const formattedDate = DateTime.fromISO(date)
      .setLocale("fr")
      .toFormat("DDDD");

    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  async function createAvailability(availability) {
    const CREATE_URL = id
      ? `/api/availabilities/member/${id}`
      : "/api/availabilities";
    await axiosPrivate.post(CREATE_URL, availability);
    getAvailabilities();
  }

  async function createSpecialAvailability(availability) {
    const CREATE_URL = id
      ? `/api/availabilities/special/member/${id}`
      : "/api/availabilities/special";
    await axiosPrivate.post(CREATE_URL, availability);
    getAvailabilities();
  }

  async function removeAvailability(id) {
    await axiosPrivate.delete(`/api/availabilities/${id}`);
    getAvailabilities();
  }

  async function removeSpecialAvailability(id) {
    await axiosPrivate.delete(`/api/availabilities/special/${id}`);
    getAvailabilities();
  }

  function formatAvailabilities(availabilities) {
    const formatted = {};

    availabilities?.forEach(({ id, dayOfWeek, startTime, endTime }) => {
      if (!formatted[dayOfWeek]) {
        formatted[dayOfWeek] = [];
      }

      formatted[dayOfWeek].push({
        id,
        start: startTime,
        end: endTime,
      });
    });

    return formatted;
  }

  if (loading) {
    return <Loader2 className="w-8 h-8 animate-spin flex-1" />;
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
          {id && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/salon/members">
                    {member?.firstName} {member?.lastName}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/salon/member/${id}/availabilities`}>Horaires</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-semibold">
        {id ? `${member?.firstName} ${member?.lastName}` : "Mes horaires"}
      </h1>
      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weekly">Par semaine</TabsTrigger>
          <TabsTrigger value="daily">Par jour</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly">
          <p className="text-muted pb-4">
            Gérez vos horaires de travail hebdomadaires.
          </p>
          {Object.entries(daysOfWeek).map(([dayFR, dayEN], i) => (
            <div key={i}>
              <DailyAvailability
                dayFR={dayFR}
                dayEN={dayEN}
                availabilities={availabilities && availabilities[dayEN]}
                createAvailability={createAvailability}
                removeAvailability={removeAvailability}
                member={member}
              />
              {i !== Object.entries(daysOfWeek).length - 1 && (
                <div className="divider w-1/2 mx-auto" />
              )}
            </div>
          ))}
        </TabsContent>
        <TabsContent value="daily">
          <p className="text-muted pb-4">
            Définissez des horaires spéciales pour des jours précis.
          </p>
          <ModalAddSpecialAvailability
            createSpecialAvailability={createSpecialAvailability}
          />
          {specialAvailabilities?.length ? (
            specialAvailabilities.map(({ id, date, startTime, endTime }) => (
              <div
                key={id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4"
              >
                <span className="flex-1 text-xl font-medium">
                  {formatDate(date)}
                </span>
                <div className="flex flex-1 gap-2">
                  <div className="flex items-center justify-center">
                    <Input
                      disabled
                      type="time"
                      defaultValue={startTime}
                      className="!opacity-100 w-min"
                    />
                    <div className="divider divider-horizontal m-0"></div>
                    <Input
                      disabled
                      type="time"
                      defaultValue={endTime}
                      className="!opacity-100 w-min"
                    />
                  </div>
                  <ModalAction
                    id={id}
                    action={removeSpecialAvailability}
                    actionLabel="Supprimer"
                    variant="destructive"
                    title="Supprimer une disponibilité spéciale"
                    description="Êtes-vous sûr de vouloir supprimer cette disponibilité spéciale ?"
                    successMessage={"Disponibilité spéciale supprimée"}
                    trigger={<MinusCircle className="text-destructive" />}
                    triggerVariant="ghost"
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">Aucune disponibilité spéciale</p>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default SalonAvailabilities;

const DailyAvailability = ({
  dayFR,
  dayEN,
  availabilities,
  createAvailability,
  removeAvailability,
  member,
}) => {
  function parseTimeString(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function formatTimeString(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  }

  const overallAvailability = (availabilities) => {
    if (!availabilities) return;
    const timeSlots = availabilities.map(({ start, end }) => ({
      start: parseTimeString(start),
      end: parseTimeString(end),
    }));

    timeSlots.sort((a, b) => a.start - b.start);

    const mergedSlots = [];
    let currentStart = timeSlots[0].start;
    let currentEnd = timeSlots[0].end;

    for (let i = 1; i < timeSlots.length; i++) {
      const slot = timeSlots[i];

      if (slot.start <= currentEnd) {
        currentEnd = Math.max(currentEnd, slot.end);
      } else {
        mergedSlots.push({ start: currentStart, end: currentEnd });
        currentStart = slot.start;
        currentEnd = slot.end;
      }
    }
    mergedSlots.push({ start: currentStart, end: currentEnd });

    return mergedSlots.map((slot) => ({
      start: formatTimeString(slot.start),
      end: formatTimeString(slot.end),
    }));
  };

  const availabilitiesToDisplay = member
    ? availabilities
    : overallAvailability(availabilities);

  return (
    <section
      className={`flex flex-col sm:flex-row gap-4 ${
        !availabilities?.length && "text-muted sm:items-center"
      }`}
    >
      <span className="text-xl font-medium sm:flex-1">{dayFR}</span>
      {availabilities?.length ? (
        <div className="space-y-2 sm:flex-2">
          {availabilitiesToDisplay?.map(({ id, start, end }) => (
            <div key={id} className="flex gap-4">
              <Input
                disabled
                type="time"
                defaultValue={start}
                className="!opacity-100 w-min"
              />
              <div className="divider divider-horizontal m-0"></div>
              <Input
                disabled
                type="time"
                defaultValue={end}
                className="!opacity-100 w-min"
              />
              {member && (
                <ModalAction
                  id={id}
                  action={removeAvailability}
                  actionLabel="Supprimer"
                  variant="destructive"
                  title="Supprimer un créneau"
                  description="Êtes-vous sûr de vouloir supprimer ce créneau de disponibilité ?"
                  successMessage={"Créneau supprimé"}
                  trigger={<MinusCircle className="text-destructive" />}
                  triggerVariant="ghost"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="sm:flex-2">{!member ? "Fermé" : "Repos"}</div>
      )}
      <div className="flex sm:flex-1 justify-end">
        {member && (
          <ModalAddAvailability
            dayOfWeek={dayEN}
            createAvailability={createAvailability}
          />
        )}
      </div>
    </section>
  );
};
