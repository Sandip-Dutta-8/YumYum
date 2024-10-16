import { useGetMyOrders } from "@/api/OrderApi";
import OrderStatusDetail from "@/components/OrderStatusDetail";
import OrderStatusHeader from "@/components/OrderStatusHeader";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const OrderStatusPage = () => {
    const { orders, isLoading } = useGetMyOrders();

    if (isLoading) {
        return <span className="w-full h-[100%] flex items-center justify-center font-bold text-2xl">Loading...</span>;
    }

    if (!orders || orders.length === 0) {
        return "No orders found";
    }

    return (
        <div className="space-y-10">
            {orders.map((order, index) => (
                <div className="space-y-10 bg-gray-50 p-10 rounded-lg dark:bg-[#020817]" key={index}>
                    <OrderStatusHeader order={order} />
                    <div className="grid gap-10 md:grid-cols-2">
                        <OrderStatusDetail order={order} />
                        <AspectRatio ratio={16 / 5}>
                            <img
                                //@ts-ignore
                                src={order.restaurant.imageUrl}
                                className="rounded-md object-cover h-full w-full"
                            />
                        </AspectRatio>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderStatusPage;