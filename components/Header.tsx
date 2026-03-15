import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { Show,
  SignInButton,
  SignUpButton,
  UserButton, } from "@clerk/nextjs";

const Header = () => {
  return (
    <header className="bg-gray-300 absolute top-0 left-0 w-full z-10">
      <nav className=" flex justify-between items-center px-4 py-3 h-16 max-w-350 mx-auto">
        <Image src="/notesstack-logo.png" alt="Logo" width={125} height={40} />
        <div className="flex justify-end items-center gap-4">
          <Link href="/dashboard">
            <Button className="cursor-pointer">Dashboard</Button>
          </Link>
          <Show when="signed-out">
              <SignInButton>
                <Button className="text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
              <Button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
              </Button>
              </SignUpButton>
          </Show>
          <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-14 h-14 rounded-full",
                    userButtonPopoverCard: "shadow-xl rounded-lg",
                    userButtonPopoverActionButton: "hover:bg-gray-100",
                  }
                }}
              />
          </Show>
        </div>
      </nav>
    </header>
  )
}

export default Header