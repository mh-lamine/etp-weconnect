import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/formatting";

export default function ProviderHeader({ name, address, profilePicture }) {
  return (
    <div
      className="hero w-full aspect-video relative max-h-[40vh] sm:max-h-[20vh] rounded-md overflow-hidden"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1619607146034-5a05296c8f9a?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
      }}
    >
      <div className="hero-overlay bg-opacity-40"></div>
      <div className="hero-content text-neutral-content mt-auto mr-auto">
        <div className="flex items-center space-x-4">
          <Avatar className="w-14 h-14">
            <AvatarImage src={profilePicture} className="border-2 rounded-full border-primary-800" />
            <AvatarFallback className="text-xl">
              {name && getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <h1 className="text-3xl font-semibold">{name}</h1>
            <p>{address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}