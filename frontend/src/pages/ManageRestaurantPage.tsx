import { useCreateMyRestaurant, useGetMyRestaurant, useUpdateMyRestaurant } from "@/api/MyRestaurantApi"
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm"

const ManageRestaurantPage = () => {

    const { createRestaurant, isLoading: isCreateLoading } = useCreateMyRestaurant();
    const { restaurant, isLoading } = useGetMyRestaurant();
    const { updateRestaurant, isLoading: isUpdateLoading } = useUpdateMyRestaurant();

    if(isLoading){
        return <span className="w-full h-[100%] flex items-center justify-center font-bold text-2xl">Loading...</span>;
    }

    const isExisting = !!restaurant;

    return (
        <ManageRestaurantForm onSave={isExisting ? updateRestaurant : createRestaurant }
            isLoading={isCreateLoading || isUpdateLoading}
            restaurant={restaurant}
        />
    )
}

export default ManageRestaurantPage
