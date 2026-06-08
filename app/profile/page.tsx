'use client';
import { motion } from "motion/react";
import ProfileView from "@/components/ProfileView";
import Header from "@/components/NavBar";



export default function Profile() {
    return (

        <div className="min-h-screen bg-black">
            <Header />

            <main className="flex justify-center px-4 py-10 mt-5">
                <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="w-full max-w-6xl"
                >
                    <ProfileView />
                </motion.div>
            </main>
        </div>
    );
}
