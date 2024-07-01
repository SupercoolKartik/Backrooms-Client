"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
//import { z } from "zod";
//import { zodResolver } from "@hookform/resolvers/zod";

//Schema of form
// export const entranceSchema = z.object({
//   username: z.string().min(2, {
//     message: "Username must be of atleast 2 characters",
//   }),
//   room: z.string().min(2, {
//     message: "Room name must be of atleast 2 characters",
//   }),
// });

//Importing componenets to butis the form
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

//Importing components needed for Card
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <main className="flex h-screen flex-col items-center justify-center">
      <Image
        src="/backroomsEntranceBg.webp"
        alt="background image"
        className="w-full h-full object-cover -z-10 blur-sm"
        layout="fill"
        priority
      />
      <Card className="flex flex-col justify-center items-center rounded-tr-sm rounded-bl-sm rounded-tl-3xl rounded-br-3xl bg-transparent mx-0">
        <CardHeader>
          <CardTitle className="text-blue-600 text-lg font-bold">
            BACKROOMS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <>
                    <FormItem>
                      <FormLabel className="text-black">Name:</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-transparent backdrop-blur-lg rounded-lg text-red-600"
                          type="text"
                          placeholder="Enter your name.."
                          {...field}
                        />
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
                      <FormLabel className="text-black">Room:</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-transparent backdrop-blur-lg rounded-lg text-red-500"
                          type="text"
                          placeholder="Enter room name.."
                          {...field}
                        />
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
              <Button type="submit" variant="entranceForm">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};
export default Entrance;
