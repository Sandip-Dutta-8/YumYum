import { useCreateMyRestaurant, useGetMyRestaurant, useGetMyRestaurantOrders, useUpdateMyRestaurant } from "@/api/MyRestaurantApi"
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderItemCard from "@/components/OrderItemCard";

const ManageRestaurantPage = () => {
    // Always call hooks unconditionally at the top
    const { createRestaurant, isLoading: isCreateLoading } = useCreateMyRestaurant();
    const { restaurant, isLoading } = useGetMyRestaurant();
    const { updateRestaurant, isLoading: isUpdateLoading } = useUpdateMyRestaurant();
    const { orders, isLoading: isOrdersLoading } = useGetMyRestaurantOrders();

    // Early return based on loading states
    if (isLoading || isOrdersLoading) {
        return <span className="w-full h-[100%] flex items-center justify-center font-bold text-2xl">Loading...</span>;
    }

    const isEditing = !!restaurant;

    return (
        <Tabs defaultValue="orders">
            <TabsList className="ml-10">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="manage-restaurant">Manage Restaurant</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-5 bg-gray-50 p-10 rounded-lg dark:bg-[#020817]">
                <h2 className="text-2xl font-bold">{orders?.length || 0} active orders</h2>
                {orders?.length ? (
                    orders.map((order, index) => <OrderItemCard key={index} order={order} />)
                ) : (
                    <span>No active orders</span>
                )}
            </TabsContent>

            <TabsContent value="manage-restaurant">
                <ManageRestaurantForm
                    restaurant={restaurant}
                    onSave={isEditing ? updateRestaurant : createRestaurant}
                    isLoading={isCreateLoading || isUpdateLoading}
                />
            </TabsContent>
        </Tabs>
    )
}

export default ManageRestaurantPage;
