"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Plus, Maximize2, Scroll } from "lucide-react";
import Parallax from "../../shared/parallax";
import { ScrollAnimatedText } from "@/components/shared/ScrollAnimatedText";

const WhyChooseUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        // `as const` so this narrows to framer-motion's Easing union rather than
        // widening to `string`, which the Variants type rejects.
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="mt-2 bg-gray-200 max-w-400 mx-auto rounded-2xl">
      <div className="px-4 sm:px-6 lg:px-16 xl:px-50 py-4 md:py-12 lg:py-16 xl:py-26">
        <ScrollAnimatedText
          title="Delivering measurable results through a strong balance of design excellence and functional performance."
          className="text-[3.50rem]"
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-end"
        >
          {/* Left side - Images with Parallax */}
          <motion.div
            variants={itemVariants}
            className="space-y-6 w-3/4"
          >
            {/* Top Image */}
            <Parallax
              className="relative w-full aspect-4/3 rounded-3xl overflow-hidden shadow-xl"
              contentClassName="size-full"
              effect="translate"
              axis="y"
              range={[-20, 20]}
              smooth
            >
              <div className="relative w-full h-full">
                <Image
                  src="/the_logo.png"
                  alt="Nexchat brand lifestyle"
                  fill
                  className="object-contain"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="text-sm font-medium text-gray-900">
                    Nexchat
                  </span>
                </div>
              </div>
            </Parallax>

            {/* Bottom Image */}
            <Parallax
              className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden shadow-xl"
              contentClassName="w-full h-full"
              effect="translate"
              axis="y"
              range={[-15, 15]}
              smooth
            >
              <div className="relative w-full h-full">
                <Image
                  src="https://images.pexels.com/photos/11035468/pexels-photo-11035468.jpeg"
                  alt="Modern design concept"
                  fill
                  className="object-cover"
                />
              </div>
            </Parallax>
          </motion.div>

          {/* Right side - Content */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Header Text */}
            <div className="space-y-4 mb-12">
              <ScrollAnimatedText
                title="Nexchat goes beyond aesthetics—bringing clarity through motion,
                flexible structure, and practical tools that help you move faster
                without defining your identity."
                className="text-base tracking-normal"
              />
            </div>

            {/* Stats and Feature Cards Grid - 2x2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 -mt-20">
              {/* Card 1: 18M Stat - Top Left */}
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col justify-between "
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl md:text-4xl font-bold text-gray-900">
                    18M
                  </h3>
                  <Plus
                    className="w-7 h-7 text-gray-900 shrink-0"
                    strokeWidth={2.5}
                  />
                </div>
              </motion.div>

              {/* Card 2: Trusted Partners - Top Right */}
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col "
              >
                <div className="flex justify-end mb-auto">
                  <p className="text-gray-900 text-base md:text-lg font-normal text-right">
                    Trusted
                    <br />
                    Partners
                  </p>
                </div>
              </motion.div>

              {/* Card 3: Business Solution - Bottom Left */}
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col min-h-[200px]"
              >
                <div className="mb-6">
                  <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-auto">
                  We always provide people a complete solution upon focused of
                  any business
                </p>
              </motion.div>

              {/* Card 4: Feature Card and 16K Stat Combined - Bottom Right */}
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col min-h-[200px]"
              >
                <div className="flex flex-col h-full">
                  {/* Maximize Icon and Text */}
                  <div className="flex-1 mb-6">
                    <div className="mb-4">
                      <Maximize2
                        className="w-9 h-9 text-gray-900"
                        strokeWidth={2}
                      />
                    </div>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                      Because sometimes the best design is the one you don't
                      have to think about.
                    </p>
                  </div>

                  {/* 16K Stat at bottom */}
                  <div className="mt-auto pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-4xl md:text-5xl font-bold text-gray-900">
                        16K
                      </h3>
                      <Plus
                        className="w-6 h-6 text-gray-900 shrink-0"
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
