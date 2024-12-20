"use client";

import { ReactNode, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Star } from "lucide-react";
import { GiChickenLeg, GiChefToque, GiHotSpices } from "react-icons/gi";
import { PiSignIn as SignIn } from "react-icons/pi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { FaRecycle } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaArrowRightLong as RightArrow } from "react-icons/fa6";
import {
  TiSocialFacebook as FB,
  TiSocialInstagram as IG,
  TiLocation as LocPin,
} from "react-icons/ti";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ADMIN } from "./constants/constants";

interface MotionWrapperProps {
  children: ReactNode;
  delay?: number;
}

const MotionWrapper = ({ children, delay = 0 }: MotionWrapperProps) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

const features = [
  {
    icon: GiChickenLeg,
    title: "Juicy Jumbo Pieces",
    description: "Size matters, especially when it comes to chicken!",
  },
  {
    icon: GiHotSpices,
    title: "Flavor Explosion",
    description: "Our secret spice blend will make your taste buds dance!",
  },
  {
    icon: GiChefToque,
    title: "Culinary Craftsmanship",
    description:
      "Each piece is a masterpiece, crafted with love and expertise.",
  },
  {
    icon: FaRecycle,
    title: "Eco-Friendly Packaging",
    description: "Saving the planet, one chicken bucket at a time!",
  },
];

const testimonials = [
  {
    name: "Juan Dela Cruz",
    comment: "Ang sarap ng chicken, parang nanalo ako sa lotto!",
    avatar: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Maria Santos",
    comment: "Mas malaki pa sa sweldo ko ang chicken nila!",
    avatar: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Pedro Penduko",
    comment: "Pwedeng pang-away sa kalye, pero mas masarap kainin!",
    avatar: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Nena Babushka",
    comment: "Parang magic, nawala ang pagod ko sa trabaho!",
    avatar: "/placeholder.svg?height=48&width=48",
  },
];

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [rotate, setRotate] = useState({ rotateX: 0, rotateY: 0 });
  const { theme, systemTheme } = useTheme();
  const router = useRouter();
  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));
  const user = useAuth();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -(y - centerY) / 12;
    const rotateY = (x - centerX) / 12;

    setRotate({ rotateX, rotateY });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center ">
          {theme === "dark" ||
          (theme === "system" && systemTheme === "dark") ? (
            <Image
              src="/cover-dark.png"
              alt="Chicken Near Me Logo"
              height={48}
              width={160}
              className="h-10 w-auto object-contain"
              priority
            />
          ) : (
            <Image
              src="/cover.png"
              alt="Chicken Near Me Logo"
              height={48}
              width={160}
              className="h-10 w-auto object-contain"
              priority
            />
          )}
        </h1>
        {(user === null || user.type === ADMIN) && (
          <Link href={`/auth`}>
            <Button
              className="opacity-25 text-sm hover:opacity-70 hover:text-md transition-all "
              variant={"ghost"}
            >
              {user && user.type === ADMIN ? `Admin Dashboard` : `Login`}
              {user && user.type === ADMIN ? <RightArrow /> : <SignIn />}
            </Button>
          </Link>
        )}
      </header>

      <main className="container mx-auto px-4 py-12 flex-grow">
        <section className="mb-24">
          <div className="flex flex-col justify-between md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <MotionWrapper>
                <h2 className="text-4xl md:text-6xl font-bold mb-4">
                  No bones. All flavor.
                </h2>
              </MotionWrapper>
              <MotionWrapper delay={0.2}>
                <p className="text-xl  mb-6">
                  Savor every bite with endless boneless goodness
                </p>
              </MotionWrapper>
              <MotionWrapper delay={0.4}>
                <Button
                  size="lg"
                  className="bg-[#C41B1B] hover:bg-[#c41b1bd7] text-white"
                  onClick={() =>
                    router.push(`https://cnm-order-form.vercel.app`)
                  }
                >
                  Order Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </MotionWrapper>
            </div>

            <div className="w-1/3">
              <motion.div
                className="relative"
                style={{ perspective: 1000 }}
                animate={{
                  rotateX: isHovered ? rotate.rotateX : 0,
                  rotateY: isHovered ? rotate.rotateY : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onMouseMove={handleMouseMove}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                <Image
                  width={1331}
                  height={888}
                  src="/logo.png"
                  alt="Chicken Near Me Logo"
                  className="rounded-3xl object-covermx-auto "
                />
                <Badge className="absolute top-16 right-14 bg-[#c41b1b] text-white text-md shadow-lg ">
                  New flavors!
                </Badge>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="mb-24">
          <h3 className="text-3xl font-bold mb-8 text-center">
            What Makes Our Chicken Clucking Amazing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <MotionWrapper key={index} delay={index * 0.1}>
                <Card className="w-full h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <feature.icon className="h-12 w-12  mb-4" />
                    <h4 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h4>
                    <p>{feature.description}</p>
                  </CardContent>
                </Card>
              </MotionWrapper>
            ))}
          </div>
        </section>

        <section className="mb-24">
          <Card className="bg-[#C41B1B] text-white">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold mb-4">
                What Our Customers Say
              </h3>

              <div className="p-10">
                <Carousel
                  className="w-full mx-auto"
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  plugins={[autoplay.current]}
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {testimonials.map((testimonial, index) => (
                      <CarouselItem
                        key={index}
                        className="w-full lg:basis-1/2 pl-2 md:pl-4"
                      >
                        <MotionWrapper key={index} delay={index * 0.1}>
                          <Card>
                            <CardContent className="p-6">
                              <div className="flex items-center mb-4">
                                <Image
                                  src={`https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXZhdGFyfGVufDB8fDB8fHww`}
                                  alt={testimonial.name}
                                  className="w-12 h-12 rounded-full mr-4 object-cover"
                                  width={48}
                                  height={48}
                                />
                                <div>
                                  <h4 className="font-semibold">
                                    {testimonial.name}
                                  </h4>
                                  <div className="flex text-[#f2ac07]">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className="h-4 w-4 fill-current"
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <p className="italic">{testimonial.comment}</p>
                            </CardContent>
                          </Card>
                        </MotionWrapper>{" "}
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious variant={"ghost"} />
                  <CarouselNext variant={"ghost"} />
                </Carousel>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="text-center">
          <h3 className="text-3xl font-bold mb-4">
            Enjoyed your meal? We'd love your feedback!
          </h3>
          <p className="text-xl  mb-8">
            Your thoughts help us make every meal even better
          </p>
          <Button
            size="lg"
            className="bg-[#C41B1B] hover:bg-[#c41b1bd7] text-white"
          >
            Give Feedback <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </section>
      </main>

      <footer className="bg-[#C41B1B] text-white">
        <div className="flex h-16 items-center justify-around w-full ">
          <div>
            <Link
              href={`https://www.facebook.com/profile.php?id=61566437186569`}
              target="_blank"
              className="flex bg-white-500 container mx-auto px-4 text-center items-center"
            >
              <FB className="w-8 h-8 " />
              <p className="ml-3">Chicken Near Me</p>
            </Link>
          </div>
          <div>
            <Link
              href={`https://www.instagram.com/chickennearmeph`}
              target="_blank"
              className="flex bg-white-500 container mx-auto px-4 text-center items-center"
            >
              <IG className="w-8 h-8 " />
              <p className="ml-3">@chickennearmeph</p>
            </Link>
          </div>
          <div>
            <Link
              href={`https://www.instagram.com/chickennearmeph`}
              target="_blank"
              className="flex bg-white-500 container mx-auto px-4 text-center items-center"
            >
              <LocPin className="w-8 h-8 " />
              <p className="ml-3">Chicken Near You Coming Soon</p>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
