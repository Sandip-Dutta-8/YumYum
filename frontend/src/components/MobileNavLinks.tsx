import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { Separator } from "./ui/separator";

const MobileNavLinks = () => {
  const { logout } = useAuth0();
  return (
    <div className="flex flex-col items-start gap-4">
      <Link
        to="/order-status"
        className="font-bold hover:text-orange-500"
      >
        Order Status
      </Link>
      <Link
        to="/manage-restaurant"
        className="font-bold hover:text-orange-500"
      >
        My Restaurant
      </Link>
      <Link
        to="/user-profile"
        className="font-bold hover:text-orange-500"
      >
        User Profile
      </Link>
      <Separator />
      <Button
        onClick={() => logout()}
        variant="destructive"
        className="px-3 font-bold"
      >
        Log Out
      </Button>
    </div>
  );
};

export default MobileNavLinks;