"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Welcome = () => {

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
    };

    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    return (
        <div style={{backgroundColor:'hsl(200deg 27.27% 97.84%)'}} className="flex flex-col items-center justify-center h-screen">
            <motion.div
                variants={imageVariants}
                initial="hidden"
                animate="visible"
            >
                <Image
                    src="/images/chatting.jpg"
                    width={500}
                    height={300}
                    alt="Illustration of people chatting"
                    priority
                />
            </motion.div>
            <motion.h1
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 text-center"
            >
                Welcome to ChatSphere
            </motion.h1>
            <motion.p
                variants={textVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
                className="text-gray-600 text-base md:text-lg text-center max-w-md"
            >
                Connect with others seamlessly. Choose a contact from the sidebar and start messaging!
            </motion.p>
        </div>
    );
};

export default Welcome;