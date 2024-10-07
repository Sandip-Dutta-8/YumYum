import { SearchState } from "@/pages/SearchPage";
import { Restaurant, RestaurantSearchResponse } from "@/types";
import { useQuery } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetRestaurant = (restaurantId?: string) => {
    const getRestaurantByIdRequest = async (): Promise<Restaurant> => {
        const response = await fetch(
            `${API_BASE_URL}/api/restaurant/${restaurantId}`
        );

        if (!response.ok) {
            throw new Error("Failed to get restaurant");
        }

        return response.json();
    };

    const { data: restaurant, isLoading } = useQuery(
        "fetchRestaurant",
        getRestaurantByIdRequest,
        {
            enabled: !!restaurantId,
        }
    );

    return { restaurant, isLoading };
};

export const useSearchRestaurants = (
    searchState: SearchState,
    city?: string
) => {
    const createSearchRequest = async (): Promise<RestaurantSearchResponse> => {
        const params = new URLSearchParams();
        params.set("searchQuery", searchState.searchQuery);
        params.set("page", searchState.page.toString());
        params.set("selectedCuisines", searchState.selectedCuisines.join(","));
        params.set("sortOption", searchState.sortOption);

        const response = await fetch(
            `${API_BASE_URL}/api/restaurant/search/${city}?${params.toString()}`
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to get restaurant");
        }

        return response.json();
    };

    const { data: results, isLoading, error } = useQuery(
        ["searchRestaurants", searchState, city],
        createSearchRequest,
        {
            enabled: !!city, // Ensure the query runs only if a city is provided
            staleTime: 0,    // Fresh data on every new search
            cacheTime: 0,    // Clear cache immediately after query becomes stale
            retry: false,    // Avoid retrying in case of failure
        }
    );

    return { results, isLoading, error };
};

