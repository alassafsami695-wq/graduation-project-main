import { getWishlists } from "@/actions/wishlist/get-wishlist";
import WishlistClient from "@/components/wishlist/WishlistClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function WishlistPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        redirect("/auth/login");
    }

    let wishlistData = [];
    try {
        const res = await getWishlists();
        wishlistData = res || [];
    } catch (error) {
        console.error("Failed to fetch wishlist on server:", error);
    }

    return (
        <div className="min-h-screen bg-bg-primary">
            <WishlistClient initialCourses={wishlistData} />
        </div>
    );
}
