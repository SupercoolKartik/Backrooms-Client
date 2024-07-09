"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/globalcontext";
import io from "socket.io-client";
import Image from "next/image";
import roomsbg from "../roomsbg.webp";
import { RiLogoutBoxLine } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { Button } from "@/components/ui/button";
import { RiSendPlane2Fill } from "react-icons/ri";
import { useForm } from "react-hook-form";

//Imports for the Navbar component
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

//Imports for the Sidebar/Sheet
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

//Imports for the Drawer
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const Room = () => {
  const router = useRouter();

  const [inputValue, setInputValue] = useState("");
  const { getTime, socket, setSocket, leavingRoom } = useAppContext();
  const [ls_name, setName] = useState<string | null>(null);
  const [ls_room, setRoom] = useState<string | null>(null);
  const [isMembersDrawerOpen, setIsMembersDrawerOpen] = useState(false);
  const [isAboutDrawerOpen, setIsAboutDrawerOpen] = useState(false);

  const messagesRef = useRef<HTMLUListElement>(null);
  // const chatRef = useRef<HTMLDivElement>(null);
  //const chatMessages = document.querySelector("#chatbox");
  // const scrollToBottom = () => {
  //   if (messagesRef.current) {
  //     messagesRef.current.scrollTop =
  //       messagesRef.current.scrollHeight - messagesRef.current.clientHeight;
  //   }
  // };

  const form = useForm({
    //resolver: zodResolver(entranceSchema),
    defaultValues: {
      message: "",
    },
  });

  //Submit logic for Shadcn form
  const onSubmit = (vals: { message: string }) => {
    const { message } = vals;
    console.log("🔎", message);
    socket.emit("sent message", {
      name: ls_name,
      room: ls_room,
      message: message,
    });
    form.setValue("message", "");
  };

  // Submit logic for Normal Form
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // scrollToBottom();
  //   if (inputValue && socket) {
  //     socket.emit("sent message", {
  //       name: ls_name,
  //       room: ls_room,
  //       message: inputValue,
  //     });
  //     setInputValue("");
  //   }
  // };

  useEffect(() => {
    if (!localStorage.getItem("name")) {
      router.push(`/entrance`, { scroll: false });
      return;
    }

    const ls_name = localStorage.getItem("name");
    const ls_room = localStorage.getItem("room");
    setName(ls_name);
    setRoom(ls_room);

    const serverUrl: any = process.env.NEXT_PUBLIC_SERVER_URL;
    const mysocket = io(serverUrl);
    setSocket(mysocket);

    mysocket.emit("userdetails", {
      name: ls_name,
      room: ls_room,
    });

    mysocket.on("chat message left", (data) => {
      const { name, room, message } = data;
      if (room === ls_room) {
        const item = document.createElement("li");
        item.className =
          "md:mr-36 sm:mr-20 mr-10 flex flex-col bg-blue-100 justify-start self-start right-2  my-1 py-2 px-2 ms-2 rounded-xl rounded-tl-none shadow-md";

        //add sender name to the chat
        const sender = document.createElement("span");
        sender.textContent = name + ": ";
        sender.className =
          "flex justify-start text-xs font-semibold text-red-500";
        item.appendChild(sender);

        //add the message send by room members
        const textArea = document.createElement("span");
        textArea.textContent = message;
        textArea.className = "flex justify-start text-black font-semibold pe-3";
        item.appendChild(textArea);

        //add the time at which the message is sent
        const date = document.createElement("span");
        date.textContent = getTime();
        date.className =
          "flex justify-start text-xs font-serif text-red-500 bottom-0";
        item.appendChild(date);
        if (messagesRef.current) messagesRef.current.appendChild(item);
        // scrollToBottom();
        //if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    });

    mysocket.on("chat message right", (data) => {
      const { name, room, message } = data;
      if (room === ls_room) {
        const item = document.createElement("li");
        item.className =
          "md:ml-36 sm:ml-20 ml-10 flex flex-col bg-blue-100 justify-end self-end right-2 my-1 py-1 px-2 me-2 rounded-xl rounded-tr-none shadow-md";

        //add sender name ("You") to the chat
        const sender = document.createElement("span");
        sender.textContent = "You:";
        sender.className = "flex justify-end text-xs font-mono text-red-500";
        item.appendChild(sender);

        //add the message send by you
        const textArea = document.createElement("span");
        textArea.textContent = message;
        textArea.className =
          "flex justify-end text-black font-normal md:font-semibold ps-3";
        item.appendChild(textArea);

        //add the time at which the message is sent
        const date = document.createElement("span");
        date.textContent = getTime();
        date.className =
          "flex justify-end text-xs font-serif text-red-500  bottom-0";
        item.appendChild(date);
        if (messagesRef.current) messagesRef.current.appendChild(item);
        // scrollToBottom();
        //if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    });

    mysocket.on("connection msg", (msg) => {
      const item = document.createElement("li");
      item.textContent = msg;
      item.className =
        "mx-auto text-black text-sm font-semibold bg-gray-400 px-3 my-1 rounded-md";
      if (messagesRef.current) messagesRef.current.appendChild(item);
      // scrollToBottom();
      //if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    return () => {
      mysocket.disconnect();
    };
  }, []);

  const toggleMembersDrawer = () => {
    isMembersDrawerOpen == true
      ? setIsMembersDrawerOpen(false)
      : setIsMembersDrawerOpen(true);
  };
  const toggleAboutDrawer = () => {
    isAboutDrawerOpen == true
      ? setIsAboutDrawerOpen(false)
      : setIsAboutDrawerOpen(true);
  };

  return (
    <div className="flex flex-col h-screen">
      <NavigationMenu className="sticky top-0 flex justify-between items-center px-3 backdrop-blur-lg border-t border-sm border-blue-800 rounded-bl-md rounded-br-md shadow-2xl ">
        {/* Logo */}
        <div className="py-1 flex flex-col justify-center items-center">
          <div className="relative ">
            {/* Backrooms */}
            <Image
              src="/BackroomsLogo.png"
              alt="backrooms logo"
              className="object-contain z-20"
              width={120} // Specify the width in pixels
              height={50} // Specify the height in pixels
              priority
            />
          </div>
          <div className="text-sm font-semibold font-mono">
            ROOM: {ls_room?.toUpperCase()}
          </div>
        </div>

        {/* Navigation Items */}
        <NavigationMenuList className="flex">
          {/* Room Information */}
          <NavigationMenuItem
            onClick={toggleMembersDrawer}
            className="hidden sm:block font-semibold hover:text-blue-200   /*hover:bg-yellow-300 hover:text-gray-300*/ py-4 px-1 hover:border-b-4 hover:border-gray-300 hover:cursor-pointer"
          >
            Room Members
          </NavigationMenuItem>
          {/* About */}
          <NavigationMenuItem
            onClick={toggleAboutDrawer}
            className="hidden sm:block text-md font-semibold hover:text-blue-200  /*hover:bg-yellow-200*/ py-4 px-1 hover:border-b-4  hover:border-gray-300 hover:cursor-pointer"
          >
            About
          </NavigationMenuItem>
          {/* Leave Room Button */}
          <NavigationMenuItem className="hidden sm:block ps-2">
            <Button
              variant="destructive"
              title="Leave Room"
              onClick={leavingRoom}
              className="px-2 py-1 bg-red-600 text-white font-bold text-xl rounded-lg hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300"
            >
              <RiLogoutBoxLine />
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem className="sm:hidden">
            {/* <Button variant="burger" size="sm" className="font-bold text-xl">
              <GiHamburgerMenu />
            </Button> */}
            <Sheet>
              <Button variant="burger" size="sm" className="font-bold text-xl">
                <SheetTrigger className="font-bold text-xl">
                  <GiHamburgerMenu />
                </SheetTrigger>
              </Button>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="mt-4 font-bold text-blue-950">
                    Backrooms
                  </SheetTitle>
                </SheetHeader>
                <ul className="pt-6 ">
                  <li
                    onClick={toggleMembersDrawer}
                    className="flex flex-row items-center mt-1 py-2 px-2 bg-yellow-400  font-semibold hover:bg-yellow-600 hover:text-blue-800 hover:cursor-pointer rounded-sm"
                  >
                    Room Members
                  </li>
                  <li
                    onClick={toggleAboutDrawer}
                    className="flex flex-row items-center mt-1 py-2 px-2 bg-yellow-400  font-semibold hover:bg-yellow-600 hover:text-blue-800 hover:cursor-pointer rounded-sm"
                  >
                    About
                  </li>
                  <li
                    onClick={leavingRoom}
                    className="flex flex-row items-center space-x-1 mt-4 py-2 px-2 bg-red-600  font-semibold hover:bg-red-700 text-white hover:text-white hover:cursor-pointer rounded-sm"
                  >
                    <RiLogoutBoxLine className="inline font-bold text-2xl" />{" "}
                    <span>Leave Room</span>
                  </li>
                </ul>
              </SheetContent>
            </Sheet>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div
        className="chatbox relative z-0 overflow-y-auto h-full bg-yellow-100"
        id="chatbox"
      >
        <div className="fixed inset-0 w-full h-full -z-10 filter blur-sm">
          <Image
            src={roomsbg}
            alt="background image"
            className="w-full h-full object-cover"
            layout="fill"
            priority
          />
        </div>
        <ul
          className="flex flex-col text-white relative z-10"
          ref={messagesRef}
          id="unoli"
        ></ul>
      </div>
      <footer className="sticky bottom-0 left-0 right-0 backdrop-blur-sm shadow-2xl">
        {/* Shadcn form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <div className="flex items-center rounded-t-lg sm:py-2 py-1 px-1">
                  <Input
                    className="flex-grow sm:ps-3 ps-2 pe-0 py-2 rounded-lg bg-transparent backdrop-blur-lg focus:backdrop-blur-sm text-blue-900 focus:outline-none focus:ring ring-blue-500 focus:ring-opacity-50"
                    type="text"
                    placeholder="Type your message..."
                    // onChange={(event) =>form.setValue("message", event.target.value)}
                    {...field}
                  />
                  <Button
                    type="submit"
                    variant="backrooms"
                    className="sm:px-4 px-3 py-4 font-bold text-lg text-white rounded-lg  focus:outline-none md:ml-1 ml-0.5"
                  >
                    <RiSendPlane2Fill />
                  </Button>
                </div>
              )}
            />
          </form>
        </Form>

        {/* Normal Form */}
        {/* 
        <form
          onSubmit={handleSubmit}
          className="w-full flex justify-end items-end px-3 py-1 bg-gray-900 shadow-md z-10"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            id="input"
            name="input"
            className="w-full px-4 py-2 mr-2 bg-gray-800 text-white focus:outline-none focus:bg-gray-700 rounded"
            placeholder="Enter your message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            <RiSendPlane2Fill />
          </button>
        </form> */}
      </footer>

      {/* Drawer to show the Room Members */}
      <Drawer open={isMembersDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Active Members</DrawerTitle>
          </DrawerHeader>
          <DrawerFooter>
            <ul>
              <li>Member 1</li>
              <li>Member 2</li>
              <li>Member 3</li>
              <li>Member 4</li>
              <li>Member 5</li>
              <li>Member 6</li>
              <li>
                Note: These are all demo members, this feature is yet to be
                implemented.
              </li>
            </ul>
            <DrawerClose>
              <Button
                onClick={toggleMembersDrawer}
                size="sm"
                variant="backrooms"
              >
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/*Drawer to show the app description*/}
      <Drawer open={isAboutDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>About</DrawerTitle>
            <DrawerDescription className="text-red-900 text-sm">
              <br />
              This is Backrooms, a chat application crafted with the latest web
              technologies to provide a seamless and interactive chatting
              experience. Developed using Next.js and TypeScript on the
              frontend, and Node.js and JavaScript on the backend, Backrooms
              offers a modern and efficient platform for real-time
              communication.
              <br />
              Powered by Socket.IO, Backrooms enables real-time messaging with
              minimal latency. Tailwind CSS and Shadcn are employed for
              effortless styling , enhancing the visual appeal of the
              application.
              <br />
              <br />
              The theme of the app is inspired by The Backrooms which is an
              internet concept and urban legend depicting an endless maze of
              randomly generated, eerie office rooms characterized by yellowed
              walls, dirty carpets, and flickering fluorescent lights.
              Originating from a 4chan post in 2019, it describes a surreal,
              unsettling place people might accidentally enter if they "noclip"
              out of reality. The Backrooms has since evolved into a popular
              online narrative, inspiring stories, games, and videos that
              explore its infinite and disorienting spaces.
              <br />
              <br />
              Join us in the world of Backrooms, where every message sent is a
              step closer to building lasting connections and unforgettable
              conversations. Welcome to the future of online communication.
              Welcome to Backrooms.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <p></p>
            <DrawerClose>
              <Button onClick={toggleAboutDrawer} size="sm" variant="backrooms">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

// export default Room;
//       {formComp()}
//     </div>
//   );
// };

export default Room;
