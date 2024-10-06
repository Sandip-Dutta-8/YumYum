import { useCreateMyRestaurant, useGetMyRestaurant, useUpdateMyRestaurant } from "@/api/MyRestaurantApi"
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm"

const ManageRestaurantPage = () => {

    const { createRestaurant, isLoading: isCreateLoading } = useCreateMyRestaurant();
    const { restaurant } = useGetMyRestaurant();
    const { updateRestaurant, isLoading: isUpdateLoading } = useUpdateMyRestaurant();

    const isExisting = !!restaurant;

    return (
        <ManageRestaurantForm onSave={isExisting ? updateRestaurant : createRestaurant }
            isLoading={isCreateLoading || isUpdateLoading}
            restaurant={restaurant}
        />
    )
}

export default ManageRestaurantPage
