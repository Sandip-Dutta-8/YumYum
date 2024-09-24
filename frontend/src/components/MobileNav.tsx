import { CircleUserRound, Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import MobileNavLinks from "./MobileNavLinks";
import { Separator } from "./ui/separator";

export function MobileNav() {

    const { isAuthenticated, loginWithRedirect, user } = useAuth0();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Menu className="text-orange-500" />
            </SheetTrigger>
            <SheetContent className="space-y-3">
                <SheetTitle>
                    {isAuthenticated ? (
                        <p className="flex items-center font-bold gap-2 text-orange-500">
                            {user?.email}
                        </p>
                    ) : (
                        <span> Welcome to YumYum!</span>
                    )}
                    <Separator />
                </SheetTitle>
                <SheetDescription>
                    {isAuthenticated ? (
                        <MobileNavLinks />
                    ) : (
                        <Button
                            onClick={async () => await loginWithRedirect()}
                            className="flex-1 font-bold bg-orange-500"
                        >
                            Log In
                        </Button>
                    )}
                </SheetDescription>
            </SheetContent>
        </Sheet>
    )
}

export default MobileNav