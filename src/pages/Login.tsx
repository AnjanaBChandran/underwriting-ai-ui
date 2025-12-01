import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Shield, Lock, FileCheck } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/cases");
  };

  const handleSSOLogin = (provider: string) => {
    // Placeholder for SSO implementation
    console.log(`SSO login with ${provider}`);
    navigate("/cases");
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Hero Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-12 flex-col justify-between relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <FileCheck className="w-8 h-8 text-primary-foreground" />
            <h1 className="text-2xl font-bold text-primary-foreground">UW Assistant</h1>
          </div>
          
          <div className="mt-16 space-y-6">
            <h2 className="text-4xl font-bold text-primary-foreground leading-tight">
              AI that helps underwriters review documents in seconds
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-md">
              Accelerate decision-making with intelligent document analysis, 
              automated risk assessment, and comprehensive audit trails.
            </p>
          </div>

          {/* Illustration placeholder - abstract shapes */}
          <div className="mt-16 relative">
            <div className="grid grid-cols-3 gap-4 opacity-20">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-primary-foreground rounded-lg"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 text-primary-foreground/60 text-sm">
          Trusted by leading insurance and financial services companies worldwide
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-border/50 backdrop-blur">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex lg:hidden items-center gap-2 mb-4 justify-center">
                <FileCheck className="w-6 h-6 text-primary" />
                <CardTitle className="text-xl">UW Assistant</CardTitle>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
              <p className="text-sm text-muted-foreground text-center">
                Use your work email to sign in
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* SSO Buttons */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSSOLogin("Microsoft")}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 23 23">
                    <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                  Continue with Microsoft
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSSOLogin("Google")}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              {/* Email Login Form */}
              <form onSubmit={handleContinue} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="underwriter@company.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </form>

              {/* Trust Footer */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    <span>ISO compliant</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    <span>Encrypted authentication</span>
                  </div>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  Your data is never shared
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Links */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Help</a>
              <span>|</span>
              <a href="#" className="hover:text-foreground transition-colors">Contact Support</a>
              <span>|</span>
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
