'use client';
import Footer from '@/Components/Global Components/Footer';
import Navbar from '@/Components/Global Components/Navbar';
import TopbarBelow from '@/Components/Global Components/TopbarBelow';
import Hearing_Test from '@/Components/Hearing_Test/Hearing_Test';
import React from 'react';
import MaintenanceScreen from '@/Components/MaintenanceScreen';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a new QueryClient instance
// const queryClient = new QueryClient();

const Page = () => {
    return (
        <>
            {/* <TopbarBelow />  */}
            {/* <Navbar /> */}
            {/* Wrap HearingTest with QueryClientProvider */}
            {/* <QueryClientProvider client={queryClient}> */}
                {/* <Hearing_Test /> */}
            {/* </QueryClientProvider> */}
            {/* <Footer /> */}
            <MaintenanceScreen />
        </>
    );
};

export default Page;
