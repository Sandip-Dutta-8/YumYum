import { Request, Response } from "express";
import Stripe from "stripe";
import Restaurant, { MenuItemType } from "../models/restaurant";
import Order from "../models/order";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;


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

const stripeWebhookHandler = async (req: Request, res: Response) => {
    let event;

    try {
      const sig = req.headers["stripe-signature"];
      event = STRIPE.webhooks.constructEvent(
        req.body,
        sig as string,
        STRIPE_ENDPOINT_SECRET
      );
    } catch (error: any) {
      console.log(error);
      return res.status(400).send(`Webhook error: ${error.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const order = await Order.findById(event.data.object.metadata?.orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      order.totalAmount = event.data.object.amount_total;
      order.status = "paid";

      await order.save();
    }

    res.status(200).send();
};

const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const checkoutSessionRequest: CheckoutSessionRequest = req.body;

        const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const newOrder = new Order({
            restaurant: restaurant,
            user: req.userId,
            status: "placed",
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems: checkoutSessionRequest.cartItems,
            createdAt: new Date(),
        })

        const lineItems = createLineItems(checkoutSessionRequest, restaurant.menuItems);

        // Validate that line items are not empty
        if (lineItems.length === 0) {
            return res.status(400).json({ message: "No valid line items found" });
        }

        const session = await createSession(
            lineItems,
            newOrder._id.toString(),
            restaurant.deliveryPrice,
            restaurant._id.toString(),
            {
                email: checkoutSessionRequest.deliveryDetails.email,
                name: checkoutSessionRequest.deliveryDetails.name,
                addressLine1: checkoutSessionRequest.deliveryDetails.addressLine1,
                city: checkoutSessionRequest.deliveryDetails.city,
                postalCode: "123456", // Provide postal code
                state: "WB",         // Provide state
                country: "IN"        // Country code for India
            }
        );

        if (!session.url) {
            return res.status(500).json({ message: "Error creating Stripe session" });
        }

        await newOrder.save();

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
    restaurantId: string,
    deliveryDetails: {
        email: string;
        name: string;
        addressLine1: string;
        city: string;
        postalCode: string;
        state: string;
        country: string;
    }
) => {
    // Create a customer first to add shipping details
    const customer = await STRIPE.customers.create({
        email: deliveryDetails.email,
        shipping: {
            name: deliveryDetails.name,
            address: {
                line1: deliveryDetails.addressLine1,
                city: deliveryDetails.city,
                postal_code: deliveryDetails.postalCode,
                state: deliveryDetails.state,
                country: deliveryDetails.country,  // E.g., "IN" for India
            },
        },
    });

    // Calculate the total cart amount
    const totalCartAmountInPaise = lineItems.reduce((total, item) => {
        return total + (item.price_data!.unit_amount! * item.quantity!);
    }, 0);

    // Apply free delivery if the total amount exceeds ₹399 (converted to paise)
    const freeDeliveryThresholdInPaise = 399 * 100; // Convert ₹399 to paise (₹1 = 100 paise)
    const applicableDeliveryPrice = totalCartAmountInPaise > freeDeliveryThresholdInPaise
        ? 0 // Free delivery
        : deliveryPrice * 100; // Charge delivery price in paise

    const sessionData = await STRIPE.checkout.sessions.create({
        line_items: lineItems,
        customer: customer.id,  // Use the customer ID created above
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: "Delivery",
                    type: "fixed_amount",
                    fixed_amount: {
                        amount: applicableDeliveryPrice, // Set delivery price based on total amount
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
    createCheckoutSession,
    stripeWebhookHandler
}