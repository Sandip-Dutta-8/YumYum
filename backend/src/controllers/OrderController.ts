import { Request, Response } from "express";
import Stripe from "stripe";
import Restaurant, { MenuItemType } from "../models/restaurant";
import Order from "../models/order";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;


type CheckoutSessionRequest = {
    cartItems: {
        menuItemId: string;
        name: string;
        quantity: string;
    }[];
    deliveryDetails: {
        email: string;
        name: string;
        addressLine1: string;
        city: string;
    };
    restaurantId: string;
};

const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const checkoutSessionRequest: CheckoutSessionRequest = req.body;

        const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId);
        if (!restaurant) {
            console.log("Restaurant not found:", checkoutSessionRequest.restaurantId);
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const lineItems = createLineItems(checkoutSessionRequest, restaurant.menuItems);

        // Validate that line items are not empty
        if (lineItems.length === 0) {
            return res.status(400).json({ message: "No valid line items found" });
        }

        const session = await createSession(
            lineItems,
            "TEST_ORDER_ID",  // Replace this with the actual order ID if needed
            restaurant.deliveryPrice,
            restaurant._id.toString()
        );

        if (!session.url) {
            return res.status(500).json({ message: "Error creating Stripe session" });
        }

        console.log("Stripe session created:", session);
        res.json({ url: session.url });
    } catch (error: any) {
        console.error("Error creating checkout session:", error);
        if (error.raw) {
            console.error("Stripe error details:", error.raw);
            return res.status(500).json({ message: error.raw.message });
        } else {
            return res.status(500).json({ message: error.message || "An unexpected error occurred" });
        }
    }
};


const createLineItems = (
    checkoutSessionRequest: CheckoutSessionRequest,
    menuItems: MenuItemType[]
) => {
    return checkoutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find(
            (item) => item._id.toString() === cartItem.menuItemId.toString()
        );

        if (!menuItem) {
            throw new Error(`Menu item not found: ${cartItem.menuItemId}`);
        }

        return {
            price_data: {
                currency: "inr",
                product_data: {
                    name: menuItem.name,
                },
                unit_amount: menuItem.price * 100,
            },
            quantity: parseInt(cartItem.quantity, 10),
        };
    });
};


const createSession = async (
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
    orderId: string,
    deliveryPrice: number,
    restaurantId: string
) => {
    const sessionData = await STRIPE.checkout.sessions.create({
        line_items: lineItems,
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: "Delivery",
                    type: "fixed_amount",
                    fixed_amount: {
                        amount: deliveryPrice * 100,
                        currency: "inr",
                    },
                },
            },
        ],
        mode: "payment",
        metadata: {
            orderId,
            restaurantId,
        },
        success_url: `${FRONTEND_URL}/order-status?success=true`,
        cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`,
    });

    return sessionData;
};

export default {
    createCheckoutSession
}