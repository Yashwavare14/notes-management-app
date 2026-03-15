import { SignIn } from "@clerk/nextjs"

const Login = () => {
  return (
    <main className="h-svh flex items-center justify-center">
      <SignIn path="/login" routing="path" signUpUrl="/register" />
    </main>
    
  )
}

export default Login