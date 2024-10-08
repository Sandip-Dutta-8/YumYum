import { CartItem } from "@/pages/DetailPage";
import { Restaurant } from "@/types";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Trash, Minus, Plus } from "lucide-react";

type Props = {
    restaurant: Restaurant;
    cartItems: CartItem[];
    removeFromCart: (cartItem: CartItem) => void;
    updateCartItemQuantity: (cartItem: CartItem, newQuantity: number) => void;
};

const OrderSummary = ({ restaurant, cartItems, removeFromCart, updateCartItemQuantity }: Props) => {
    // Calculate the total cost
    const getTotalCost = () => {
        const totalInPence = cartItems.reduce(
            (total, cartItem) => total + cartItem.price * cartItem.quantity,
            0
        );
        const totalWithDelivery = totalInPence < 399 ? totalInPence + restaurant.deliveryPrice : totalInPence;
        return (totalWithDelivery).toFixed(2);
    };

    // Calculate delivery charge for display
    const getDeliveryCost = () => {
        return cartItems.reduce(
            (total, cartItem) => total + cartItem.price * cartItem.quantity,
            0
        ) < 399
            ? (restaurant.deliveryPrice).toFixed(2)
            : "0.00"; // No delivery charge if total is above 399
    };

    // Decrease the quantity of a cart item by 1 or remove it if the quantity reaches 0
    const decreaseQuantity = (cartItem: CartItem) => {
        if (cartItem.quantity > 1) {
            updateCartItemQuantity(cartItem, cartItem.quantity - 1);
        } else {
            removeFromCart(cartItem);
        }
    };

    // Increase the quantity of a cart item by 1
    const increaseQuantity = (cartItem: CartItem) => {
        updateCartItemQuantity(cartItem, cartItem.quantity + 1);
    };

    return (
        <>
            <CardHeader>
                <CardTitle className="text-2xl font-bold tracking-tight flex justify-between">
                    <span>Your Order</span>
                    <span>₹{getTotalCost()}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
                {cartItems.map((item, index) => (
                    <div className="flex justify-between items-center" key={index}>
                        <span className="flex items-center">
                            {/* Minus Button to decrease quantity */}
                            <Minus
                                className="cursor-pointer mr-2"
                                size={20}
                                onClick={() => decreaseQuantity(item)}
                            />
                            <Badge variant="outline" className="mr-2">
                                {item.quantity}
                            </Badge>
                            <Plus
                                className="cursor-pointer mr-2"
                                size={20}
                                onClick={() => increaseQuantity(item)}
                            />
                            {item.name}
                        </span>
                        <span className="flex items-center gap-1">
                            <Trash
                                className="cursor-pointer"
                                color="red"
                                size={20}
                                onClick={() => removeFromCart(item)}
                            />
                            ₹{((item.price * item.quantity)).toFixed(2)}
                        </span>
                    </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>₹{getDeliveryCost()}</span>
                </div>
                <Separator />
            </CardContent>
        </>
    );
};

export default OrderSummary;
