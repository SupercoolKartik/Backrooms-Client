"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/globalcontext";
import io from "socket.io-client";
import { RiLogoutBoxLine } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { Button } from "@/components/ui/button";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // scrollToBottom();
    if (inputValue && socket) {
      socket.emit("sent message", {
        name: ls_name,
        room: ls_room,
        message: inputValue,
      });
      setInputValue("");
    }
  };

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
          "w-3/4 flex flex-col bg-blue-200 justify-start self-start right-2  my-1 py-2 px-2 ms-2 rounded-lg shadow-md";

        //add sender name to the chat
        const sender = document.createElement("span");
        sender.textContent = name + ": ";
        sender.className =
          "flex justify-start text-xs font-semibold text-red-500";
        item.appendChild(sender);

        //add the message send by room members
        const textArea = document.createElement("span");
        textArea.textContent = message;
        textArea.className = "flex justify-start text-black font-semibold";
        item.appendChild(textArea);

        //add the time at which the message is sent
        const date = document.createElement("span");
        date.textContent = getTime();
        date.className =
          "flex justify-start text-sm font-semibold text-red-500  bottom-0";
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
          "w-3/4 flex flex-col bg-blue-200 justify-end self-end right-2  my-1 py-1 px-2 me-2 rounded-lg shadow-md";

        //add sender name ("You") to the chat
        const sender = document.createElement("span");
        sender.textContent = "You:";
        sender.className =
          "flex justify-end text-xs font-semibold text-red-500";
        item.appendChild(sender);

        //add the message send by you
        const textArea = document.createElement("span");
        textArea.textContent = message;
        textArea.className = "flex justify-end text-black font-semibold";
        item.appendChild(textArea);

        //add the time at which the message is sent
        const date = document.createElement("span");
        date.textContent = getTime();
        date.className =
          "flex justify-end text-sm font-semibold text-red-500  bottom-0";
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

  const formComp = () => {
    return (
      <form
        onSubmit={handleSubmit}
        className="w-full flex fixed bottom-0 justify-end items-end px-3 py-1 bg-gray-900 shadow-md z-10"
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
          Send
        </button>
      </form>
    );
  };
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

  // const closeDrawer = () => {
  //   setIsDrawerOpen(false);
  // };

  return (
    <div className="flex flex-col h-screen ">
      <NavigationMenu className="bg-yellow-600 flex justify-between items-center px-3 rounded-bl-md rounded-br-md shadow-2xl">
        {/* Logo */}
        <div className="py-2">
          <div className="flex flex-col text-blue-950 font-bold  text-xl">
            Backrooms
          </div>
          <div className="text-xs font-semibold">
            ROOM: {ls_room?.toUpperCase()}
          </div>
        </div>

        {/* Navigation Items */}
        <NavigationMenuList className="flex">
          {/* Room Information */}
          <NavigationMenuItem
            onClick={toggleMembersDrawer}
            className="hidden sm:block font-semibold hover:text-purple-950   /*hover:bg-yellow-300 hover:text-gray-300*/ py-4 px-1 hover:border-b-4 hover:border-gray-300 hover:cursor-pointer"
          >
            Room Members
          </NavigationMenuItem>
          {/* About */}
          <NavigationMenuItem
            onClick={toggleAboutDrawer}
            className="hidden sm:block text-md font-semibold hover:text-purple-950  /*hover:bg-yellow-200*/ py-4 px-1 hover:border-b-4  hover:border-gray-300 hover:cursor-pointer"
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
        className="chatbox relative z-0 overflow-y-auto h-full mb-12 "
        id="chatbox"
        // ref={chatRef}
      >
        <ul
          className="flex flex-col text-white"
          ref={messagesRef}
          id="unoli"
        ></ul>
      </div>
      {formComp()}
      //Drawer to show the Room Members
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
              <li>Member 7</li>
              <li>Member 8</li>
              <li>Member 9</li>
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
      //Drawer to show the app description
      <Drawer open={isAboutDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>About</DrawerTitle>
            <DrawerDescription className="text-red-900">
              This is a chat app developed by Suraj Kr Saw
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
