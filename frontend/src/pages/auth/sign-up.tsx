import SignUpForm from "./_component/signup-form"
import Logo from "@/components/logo/logo"
import dashboardImg from "../../assets/images/BG-Light.jpg";
import dashboardImgDark from "../../assets/images/BG-Dark.jpg";
import { useTheme } from "@/context/theme-provider";


const SignUp = () => {
  const { theme } = useTheme();
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 md:pt-6">
        <div className="flex justify-center gap-2 md:justify-start">
          <Logo url="/" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignUpForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block -mt-3">
        <div className="absolute inset-0 flex flex-col items-end justify-end pt-8 pl-8">
          <div className="w-full max-w-3xl mx-0 pr-5">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground leading-[1.1]">
              Meet FinSight, your AI-powered <br className="hidden md:block" /> financial co-pilot.
            </h1>
            <p className="mt-4 text-pretty text-muted-foreground max-w-[85%]">
              Gain deep insights into your spending patterns with automated monthly reports, CSV imports, and intelligent recurring transaction tracking.
            </p>
          </div>
          <div className="relative max-w-3xl h-full w-full overflow-hidden mt-6 rounded-2xl border border-border/50 shadow-2xl">
            {/* soft glow behind edges */}
            <div className="pointer-events-none absolute -inset-4 rounded-3xl blur-3xl opacity-20 bg-gradient-to-br from-primary via-primary/20 to-transparent" />
            <img
              src={theme === "dark" ? dashboardImgDark : dashboardImg}
              alt="Dashboard"
              className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500"
              style={{
                objectPosition: "left top",
                transform: "scale(1.15)",
                transformOrigin: "left top",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp