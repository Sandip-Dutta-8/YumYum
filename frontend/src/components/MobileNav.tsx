import { CircleUserRound, Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "./ui/button";

export function MobileNav() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Menu className="text-orange-500" />
            </SheetTrigger>
            <SheetContent className="space-y-3">
                <SheetTitle>
                    <span> Welcome to YumYum!</span>
                </SheetTitle>
                <SheetDescription>
                    <Button
                        onClick={() => {}}
                        className="flex-1 font-bold bg-orange-500"
                    >
                        Log In
                    </Button>
                </SheetDescription>
            </SheetContent>
        </Sheet>
    )
}

export default MobileNav