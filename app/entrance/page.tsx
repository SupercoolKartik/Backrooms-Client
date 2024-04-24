"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppContext } from "@/context/globalcontext";
import { z } from "zod";
//import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";

//Schema of form
// export const entranceSchema = z.object({
//   username: z.string().min(2, {
//     message: "Username must be of atleast 2 characters",
//   }),
//   room: z.string().min(2, {
//     message: "Room name must be of atleast 2 characters",
//   }),
// });

//Exporting componenets to butis the form
import { Button } from "@/components/ui/button";
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
//npx shadcn-ui@latest add input

const Entrance = () => {
  const router = useRouter();

  const form = useForm({
    //resolver: zodResolver(entranceSchema),
    defaultValues: {
      username: "",
      room: "",
    },
  });
  // z.infer<typeof entranceSchema>;
  const onSubmit = (vals: { username: string; room: string }) => {
    const { username, room } = vals;
    localStorage.setItem("name", username);
    localStorage.setItem("room", room);

    return router.push(`/rooms`, { scroll: false });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>Enter Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Dohn Joe" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name="room"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>Enter Room</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Room_105" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          {/* <Link href={"/forgot"} className="flex items-end justify-end">
            <p className="text-red-500 text-xs font-semibold hover:text-red-600 ">
              Forgot Password?
            </p>
          </Link> */}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </main>
  );
};
export default Entrance;
