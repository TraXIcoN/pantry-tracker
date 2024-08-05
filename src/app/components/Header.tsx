"use client";
import React, { useState } from "react";
import { SiShopee } from "react-icons/si";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/auth/AuthProvider"; // Adjust the import path as needed
import { motion } from "framer-motion";

const buttonStyle = {
  backgroundColor: "#000000",
  color: "#ffffff",
  paddingBlock: "12px",
  paddingInline: "32px",
  width: "100%",
  marginBlock: 2,
  "&:hover": {
    backgroundColor: "#0069d9",
    borderColor: "#0062cc",
    boxShadow: "none",
  },
};

interface HeaderProps {
  onSearch: (query: string) => void; // Prop to handle search query
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const logOut = () => {
    signOut(auth);
    router.push("/auth/login");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value); // Notify parent component of the search query
  };

  const handleSearchClick = () => {
    if (user) {
      setIsSearchActive(true);
    }
  };

  return (
    <div className="w-full fixed top-0 left-0 z-50 flex flex-col md:flex-row justify-center md:justify-between items-center px-2 md:px-10 py-5 bg-white">
      <div
        className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-56 cursor-pointer"
        onClick={handleSearchClick}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
          className="flex justify-center items-center gap-2"
        >
          <SiShopee size={34} className="text-red-700" />
          <h4 className="font-Poppins font-bold text-gray-900 text-xl tracking-wide">
            Kitchenkeeper
          </h4>
        </motion.div>
        {user && (
          <motion.div
            initial={{ width: "0px", opacity: 0 }}
            animate={{
              width: isSearchActive ? "100%" : "0px",
              opacity: isSearchActive ? 1 : 0,
            }}
            transition={{ duration: 0.5 }}
            className="relative flex-grow mx-4 mt-4 md:mt-0"
          >
            <input
              type="text"
              placeholder="Search for items in your pantry"
              value={searchQuery}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              onChange={handleSearchChange}
            />
          </motion.div>
        )}
      </div>
      <div className="flex flex-col md:flex-row items-center gap-5 mt-4 md:mt-0">
        {!user && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-blue-700 text-white text-xs md:text-sm font-Poppins rounded-[0.5rem] px-6 py-[0.8rem] hover:font-bold transition-all"
            >
              <Link href="/auth/signup">Get Started</Link>
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-200 text-black text-xs md:text-sm font-Poppins rounded-[0.5rem] px-6 py-[0.8rem] hover:bg-blue-200 hover:font-bold transition-all"
            >
              <Link href="/auth/login">Login</Link>
            </motion.button>
          </>
        )}
        {user && (
          <button
            onClick={logOut}
            className="bg-gray-200 text-black text-xs md:text-sm font-Poppins rounded-[0.5rem] px-6 py-[0.8rem] hover:bg-blue-200 hover:font-bold transition-all"
          >
            Log Out
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
