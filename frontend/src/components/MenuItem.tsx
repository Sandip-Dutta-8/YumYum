import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MenuItem } from "../types";
import { Plus } from "lucide-react";

type Props = {
    menuItem: MenuItem;
    addToCart: () => void;
};

const MenuItems = ({ menuItem, addToCart }: Props) => {
    return (
        <Card className="flex items-center justify-between px-4 py-2">
            <CardContent className="flex flex-col gap-4 py-2 px-2">
                <CardHeader className="p-0">
                    <CardTitle>{menuItem.name}</CardTitle>
                </CardHeader>
                <CardContent className="font-bold p-0">
                    ₹{(menuItem.price).toFixed(2)}
                </CardContent>
            </CardContent>
            <CardContent className="cursor-pointer hover:bg-gray-50 rounded-md p-2 dark:hover:bg-[#111e40be]" onClick={addToCart}>
                <Plus />
            </CardContent>
        </Card>
    );
};

export default MenuItems;