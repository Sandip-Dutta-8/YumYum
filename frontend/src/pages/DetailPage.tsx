import { useGetRestaurant } from "@/api/RestaurantApi";
import MenuItems from "@/components/MenuItem";
import OrderSummary from "@/components/OrderSummary";
import RestaurantInfo from "@/components/RestaurantInfo";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardFooter } from "@/components/ui/card";
import { MenuItem } from "@/types";
import { useState } from "react";
import { useParams } from "react-router-dom"

export type CartItem = {
    _id: string;
    name: string;
    quantity: number;
    price: number;
}

function DetailPage() {
    const { restaurantId } = useParams();
    const { restaurant, isLoading } = useGetRestaurant(restaurantId);

    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    if (isLoading || !restaurant) {
        return <span className="w-full h-[100%] flex items-center justify-center font-bold text-2xl">Loading...</span>;
    }

    const addToCart = (menuItem: MenuItem) => {
        setCartItems((prevCartItems) => {
            const existingCartItem = prevCartItems.find((cartItem) => cartItem._id === menuItem._id);

            let updatedCartItems;

            if (existingCartItem) {
                updatedCartItems = prevCartItems.map((cartItem) =>
                    cartItem._id === menuItem._id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                updatedCartItems = [
                    ...prevCartItems,
                    {
                        _id: menuItem._id,
                        name: menuItem.name,
                        price: menuItem.price,
                        quantity: 1,
                    },
                ];
            }
            return updatedCartItems;
        })
    }

    const removeFromCart = (cartItem: CartItem) => {
        setCartItems((prevCartItems) => {
            const updatedCartItems = prevCartItems.filter(
                (item) => cartItem._id !== item._id
            );

            // sessionStorage.setItem(
            //     `cartItems-${restaurantId}`,
            //     JSON.stringify(updatedCartItems)
            // );

            return updatedCartItems;
        });
    }

    const updateCartItemQuantity = (cartItem: CartItem, newQuantity: number) => {
        setCartItems((prevCartItems) =>
            prevCartItems.map((item) =>
                item._id === cartItem._id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    return (
        <div className="flex flex-col gap-10 lg:mx-10">
            <AspectRatio ratio={16 / 5}>
                <img
                    //@ts-ignore
                    src={restaurant.imageUrl}
                    className="md:rounded-md object-cover h-full w-full"
                />
            </AspectRatio>
            <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32 mx-4">
                <div className="flex flex-col gap-4">
                    <RestaurantInfo restaurant={restaurant} />
                    <span className="text-2xl font-bold tracking-tight">Menu</span>
                    {restaurant.menuItems.map((menuItem, index) => (
                        <MenuItems
                            key={index}
                            menuItem={menuItem}
                            addToCart={() => addToCart(menuItem)}
                        />
                    ))}
                </div>

                <div>
                    <Card>
                        <OrderSummary
                            restaurant={restaurant}
                            cartItems={cartItems}
                            removeFromCart={removeFromCart}
                            updateCartItemQuantity={updateCartItemQuantity}
                        />
                        Order Summary
                        <CardFooter>
                            {/* <CheckoutButton
                                disabled={cartItems.length === 0}
                                onCheckout={onCheckout}
                                isLoading={isCheckoutLoading}
                            /> */}/
                            Checkout Button
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default DetailPage