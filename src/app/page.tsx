"use client";
import React from "react";
import Image from "next/image";
import { SiShopee } from "react-icons/si";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="py-2">
      <header className="flex justify-center md:justify-between items-center gap-14 py-3 px-2 md:px-10">
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.1,
          }}
        >
          <div className="flex justify-center items-center gap-2">
            <SiShopee size={34} className="text-red-700" />
            <h4 className="font-Poppins font-bold text-gray-900 text-xl tracking-wide">
              KitchenKeeper
            </h4>
          </div>
        </motion.div>
        <div className="flex justify-center items-center gap-5">
          <motion.button
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
            }}
            className="bg-red-700 text-white  text-xs md:text-sm font-Poppins rounded-[0.5rem] px-6 py-[0.8rem] hover:font-bold transition-all"
          >
            <Link href="/auth/signup">Get Started</Link>
          </motion.button>
          <motion.button
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.5,
            }}
            className="bg-gray-200 text-black text-xs md:text-sm font-Poppins rounded-[0.5rem] px-6 py-[0.8rem] hover:bg-red-200 hover:font-bold transition-all"
          >
            <Link href="/auth/login">Login</Link>
          </motion.button>
        </div>
      </header>
      <hr />
      <section className="md:h-[90vh]  py-5 md:py-0  md:mt-0 px-10 flex flex-col md:flex-row justify-center items-center space-x-0 md:space-x-14">
        <div className="md:w-3/5 flex flex-col gap-2 text-center md:text-left">
          <motion.h1
            initial={{
              opacity: 0,
              x: -100,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
            className="font-Poppins font-semibold text-5xl md:text-[4rem] text-black leading-tight"
          >
            Track, manage, and enjoy your perfectly organized pantry—because
            that&#39;s everyone&#39;s dream, right?
          </motion.h1>
          <motion.p
            initial={{
              opacity: 0,
              x: -100,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.4,
            }}
            className="font-Poppins text-sm text-black/40 leading-normal md:w-2/3"
          >
            KitchenKeeper is here to revolutionize how you manage your pantry.
            Say goodbye to the chaos of expired food and last-minute grocery
            runs. With our easy-to-use app, you can keep track of everything in
            your pantry, fridge, and freezer.
          </motion.p>
        </div>
        <motion.div
          initial={{
            opacity: 0,
            x: 100,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 0.2,
          }}
          className="md:w-2/5"
        >
          <Image
            src="/pantry.gif"
            width={500}
            height={500}
            alt="Kitchen Pantry"
          />
        </motion.div>
      </section>
    </main>
  );
}
