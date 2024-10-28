import axiosPrivate from "@/api/axiosPrivate";
import ModalAddMember from "@/components/modal/ModalAddMember";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SalonMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getMembers();
  }, []);

  async function getMembers() {
    try {
      const { data } = await axiosPrivate.get("/api/salon/members");
      setMembers(data);
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: location }, replace: true });
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }
  async function addMember(member) {
    try {
      await axiosPrivate.post("/api/salon", member);
      getMembers();
      toast.success("Membre ajouté avec succès.");
    } catch (error) {
      toast.error(error.message);
    }
  }

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
              <Link to="/salon/members">Membres</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div>
        <h1 className="text-3xl font-semibold">Mon équipe</h1>
        <ModalAddMember addMember={addMember} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nom</TableHead>
            <TableHead>Code d'accès</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">
                {member.firstName} {member.lastName}
              </TableCell>
              <TableCell>{member.accessCode}</TableCell>
              <TableCell className="text-right">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="ml-4">
                      <EllipsisVertical />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-fit flex flex-col gap-2"
                  >
                    <Link
                      to={`/salon/members/${member.id}/informations`}
                      asChild
                    >
                      <Button className="w-full" variant="outline">
                        Informations
                      </Button>
                    </Link>
                    <Link
                      to={`/salon/members/${member.id}/availabilities`}
                      asChild
                    >
                      <Button className="w-full" variant="outline">
                        Disponibilités
                      </Button>
                    </Link>
                    <Link to={`/salon/members/${member.id}/services`} asChild>
                      <Button className="w-full" variant="outline">
                        Prestations
                      </Button>
                    </Link>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
