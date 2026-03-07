import { Button } from "./ui/button";
import { Show,
  SignInButton,
  SignUpButton,
  UserButton, } from "@clerk/nextjs";

const Header = () => {
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16 bg-[#000]">
      <Button variant={"secondary"} >Dashboard</Button>
        <Show when="signed-out">
            <SignInButton />
            <SignUpButton>
            <Button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                Sign Up
            </Button>
            </SignUpButton>
        </Show>
        <Show when="signed-in">
            <UserButton />
        </Show>
    </header>
  )
}

export default Header