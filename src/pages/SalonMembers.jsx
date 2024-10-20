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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function SalonMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMembers();
  }, []);

  async function getMembers() {
    try {
      const { data } = await axiosPrivate.get("/api/salon/members");
      console.log(data);
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
        <h1 className="text-3xl font-semibold">Mes membres</h1>
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
              <TableCell>
                <Button variant="ghost">
                  <EllipsisVertical />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
