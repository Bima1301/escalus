import { db } from "@/server/db"
import { redirect } from "next/navigation"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"

const SycnUser = async () => {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("User not found")
    }

    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    const emailAddress = user.emailAddresses[0]?.emailAddress

    if (!emailAddress) {
        return notFound()
    }

    await db.user.upsert({
        where: { emailAddress },
        update: {
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
        },
        create: {
            id: userId,
            emailAddress,
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
        },
    })

    redirect("/dashboard")
}
export default SycnUser
