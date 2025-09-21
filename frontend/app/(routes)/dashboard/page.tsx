"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@context/UserContext";
import { WelcomeHero } from "@components/UI/DashboardComponents";
import "@/styles/dashboard-animations.css";

const HomePage = () => {
    const { user } = useUser();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen">
            {/* Hero Section with Amazing Logo Animation */}
            <WelcomeHero
                userName={user?.name}
                userRole={user?.role}
            />
        </div>
    );
};

export default HomePage;