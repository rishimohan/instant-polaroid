"use client";

import { motion } from "framer-motion";
import {
  FilmStripIcon,
  GithubLogoIcon,
  Heart,
  PlugsConnectedIcon,
} from "@phosphor-icons/react";
import Link from "next/link";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-3 mb-8 sm:mb-10"
    >
      <div>
        <div className="flex items-center justify-center gap-1">
          <FilmStripIcon
            className="size-8 rotate-90 text-gray-700"
            weight="regular"
          />

          <Link href="/">
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight bg-linear-to-r from-neutral-800 to-black text-transparent bg-clip-text">
              <span className="">Instant</span> Polaroid
            </h1>
          </Link>
        </div>
        <h2 className="text-sm sm:text-base mt-1 text-neutral-500 max-w-md mx-auto">
          Upload or capture a photo, and watch it transform into a beautiful
          polaroid print instantly
        </h2>
      </div>

      <div className="mt-6 text-center md:pb-2 text-sm text-neutral-400 flex flex-col md:flex-row items-center gap-2 justify-center">
        <div className="flex items-center gap-1">
          <Heart />
          Built with love using{" "}
          <a
            href="https://orshot.com?ref=instant-polaroid"
            target="_blank"
            className="underline underline-offset-2 hover:text-neutral-700 transition-colors text-neutral-400"
          >
            Orshot
          </a>
        </div>
        <span className="hidden md:inline-block">&middot;</span>
        <div className="flex items-center gap-1">
          <GithubLogoIcon />
          <a
            href="https://github.com/rishimohan/instant-polaroid-app"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-neutral-700 transition-colors text-neutral-400"
          >
            Open Source
          </a>
        </div>
      </div>
    </motion.header>
  );
}
