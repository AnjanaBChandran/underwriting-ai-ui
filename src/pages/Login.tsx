import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, KeyRound, Eye, EyeOff } from "lucide-react";
import loginIllustration from "@/assets/login-illustration.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/cases");
  };

  return (
    <div className="min-h-screen flex bg-[hsl(230,25%,97%)]">
      {/* Left Illustration Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[hsl(220,20%,92%)] items-center justify-center p-12">
        <img
          src={loginIllustration}
          alt="Secure login illustration"
          className="max-w-md w-full h-auto object-contain"
        />
      </div>

      {/* Right Login Panel */}
      <div className="flex-1 flex items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-foreground mb-8">Sign in</h1>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Field */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/60" />
              <Input
                type="text"
                placeholder="Enter your ID"
                className="pl-12 pr-10 h-12 bg-card border-border/60 rounded-lg shadow-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/60" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="pl-12 pr-12 h-12 bg-card border-border/60 rounded-lg shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-[hsl(230,60%,30%)] hover:bg-[hsl(230,60%,25%)] text-primary-foreground rounded-full text-base font-medium shadow-md"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
