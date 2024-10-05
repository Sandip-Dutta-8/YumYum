import { Form } from '@/components/ui/form';
import { Restaurant } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import DetailsSection from './DetailsSection';
import { Separator } from '@/components/ui/separator';
import CuisinesSection from './CuisinesSection';
import MenuSection from './MenuSection';
import ImageSection from './ImageSection';
import LoadingButton from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';


const formSchema = z
    .object({
        restaurantName: z.string({
            required_error: "restuarant name is required",
        }),
        city: z.string({
            required_error: "city is required",
        }),
        country: z.string({
            required_error: "country is required",
        }),
        deliveryPrice: z.coerce.number({
            required_error: "delivery price is required",
            invalid_type_error: "must be a valid number",
        }),
        estimatedDeliveryTime: z.coerce.number({
            required_error: "estimated delivery time is required",
            invalid_type_error: "must be a valid number",
        }),
        cuisines: z.array(z.string()).nonempty({
            message: "please select at least one item",
        }),
        menuItems: z.array(
            z.object({
                name: z.string().min(1, "name is required"),
                price: z.coerce.number().min(1, "price is required"),
            })
        ),
        // imageUrl: z.string().optional(),
        imageFile: z.instanceof(File, { message: "image is required" })
    });
// .refine((data) => data.imageUrl || data.imageFile, {
//     message: "Either image URL or image File must be provided",
//     path: ["imageUrl"],
// });

type restaurantFormData = z.infer<typeof formSchema>;


type Props = {
    onSave: (restaurantFormData: FormData) => void;
    isLoading: boolean;
}

function ManageRestaurantForm({ onSave, isLoading }: Props) {
    const form = useForm<restaurantFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cuisines: [],
            menuItems: [{ name: "", price: 0 }],
        },
    });

    const onSubmit = (formDataJson: restaurantFormData) => {
        const formData = new FormData();

        formData.append("restaurantName", formDataJson.restaurantName);
        formData.append("city", formDataJson.city);
        formData.append("country", formDataJson.country);

        formData.append(
            "deliveryPrice",
            (formDataJson.deliveryPrice).toString()
        );
        formData.append(
            "estimatedDeliveryTime",
            formDataJson.estimatedDeliveryTime.toString()
        );
        formDataJson.cuisines.forEach((cuisine, index) => {
            formData.append(`cuisines[${index}]`, cuisine);
        });
        formDataJson.menuItems.forEach((menuItem, index) => {
            formData.append(`menuItems[${index}][name]`, menuItem.name);
            formData.append(
                `menuItems[${index}][price]`,
                (menuItem.price).toString()
            );
        });

        formData.append(`imageFile`, formDataJson.imageFile);

        onSave(formData);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 bg-slate-50 dark:bg-[#020817] rounded-lg p-6 md:p-10 lg:mx-10'>
                <DetailsSection />
                <Separator />
                <CuisinesSection />
                <Separator />
                <MenuSection />
                <Separator />
                <ImageSection />
                <Separator />

                {isLoading ? <LoadingButton /> : <Button type="submit">Submit</Button>}
            </form>
        </Form>
    )
}

export default ManageRestaurantForm

