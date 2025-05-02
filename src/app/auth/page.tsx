"use client"
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MyField } from "@/components/my-field";
import { Eye, EyeOff, User, Mail, Phone, Lock, Building } from "lucide-react";
import { Input } from "@/components/ui/input";

const userSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Please enter your password.",
  }),
});

const serviceProviderSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  profession: z.string().min(1, {
    message: "Please select a profession.",
  }),
  experience: z.string().min(1, {
    message: "Please enter your experience.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function AuthForms() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [userType, setUserType] = useState("user");
  
  const userForm = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });
  
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const serviceProviderForm = useForm({
    resolver: zodResolver(serviceProviderSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      profession: "",
      experience: "",
      password: "",
    },
  });

  function onUserSubmit(values) {
    console.log(values);
    // Handle user signup
  }
  
  function onLoginSubmit(values) {
    console.log(values);
    // Handle login
  }
  
  function onServiceProviderSubmit(values) {
    console.log(values);
    // Handle service provider signup
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="shadow-lg border-t-4 border-t-blue-500">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
                <CardDescription className="text-center">Login to your account to continue</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <MyField
                      form={loginForm}
                      name="email"
                      label="Email"
                      placeholder="Enter your email"
                      input={(field) => (
                        <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                          <div className="flex items-center justify-center w-10 h-10 text-gray-400">
                            <Mail size={20} />
                          </div>
                          <Input
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="Enter your email"
                            {...field}
                          />
                        </div>
                      )}
                    />
                    
                    <MyField
                      form={loginForm}
                      name="password"
                      label="Password"
                      placeholder="Enter your password"
                      input={(field:any) => (
                        <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                          <div className="flex items-center justify-center w-10 h-10 text-gray-400">
                            <Lock size={20} />
                          </div>
                          <Input
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                          />
                          <div 
                            className="flex items-center justify-center w-10 h-10 cursor-pointer text-gray-400"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </div>
                        </div>
                      )}
                    />

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="remember" className="rounded text-blue-500 focus:ring-blue-500" />
                        <label htmlFor="remember">Remember me</label>
                      </div>
                      <a href="#" className="text-blue-500 hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    
                    <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                      Login
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-gray-600">
                  Dont have an account?{" "}
                  <button
                    onClick={() => setActiveTab("signup")}
                    className="text-blue-500 hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card className="shadow-lg border-t-4 border-t-green-500">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Create Account</CardTitle>
                <CardDescription className="text-center">Sign up as a user or service provider</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Button
                    type="button"
                    variant={userType === "user" ? "default" : "outline"}
                    className={userType === "user" ? "bg-green-500 hover:bg-green-600" : ""}
                    onClick={() => setUserType("user")}
                  >
                    User
                  </Button>
                  <Button
                    type="button"
                    variant={userType === "provider" ? "default" : "outline"}
                    className={userType === "provider" ? "bg-green-500 hover:bg-green-600" : ""}
                    onClick={() => setUserType("provider")}
                  >
                    Service Provider
                  </Button>
                </div>
                
                {userType === "user" ? (
                  <Form {...userForm}>
                    <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
                      <MyField
                        form={userForm}
                        name="name"
                        label="Full Name"
                        placeholder="Enter your full name"
                        input={(field) => (
                          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
                            <div className="flex items-center justify-center w-10 h-10 text-gray-400">
                              <User size={20} />
                            </div>
                            <Input
                              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="Enter your full name"
                              {...field}
                            />
                          </div>
                        )}
                      />
                      
                      <MyField
                        form={userForm}
                        name="email"
                        label="Email"
                        placeholder="Enter your email"
                        input={(field) => (
                          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
                            <div className="flex items-center justify-center w-10 h-10 text-gray-400">
                              <Mail size={20} />
                            </div>
                            <Input
                              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="Enter your email"
                              {...field}
                            />
                          </div>
                        )}
                      />
                      
                      <MyField
                        form={userForm}
                        name="phone"
                        label="Phone Number"
                        placeholder="Enter your phone number"
                        input={(field) => (
                          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
                            <div className="flex items-center justify-center w-10 h-10 text-gray-400">
                              <Phone size={20} />
                            </div>
                            <Input
                              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="Enter your phone number"
                              {...field}
                            />
                          </div>
                        )}
                      />
                      
                      <MyField
                        form={userForm}
                        name="password"
                        label="Password"
                        placeholder="Create a password"
                        input={(field) => (
                          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
                            <div className="flex items-center justify-center w-10 h-10 text-gray-400">
                              <Lock size={20} />
                            </div>
                            <Input
                              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a password"
                              {...field}
                            />
                            <div 
                              className="flex items-center justify-center w-10 h-10 cursor-pointer text-gray-400"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </div>
                          </div>
                        )}
                      />
                      
                      <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
                        Create User Account
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <Form {...serviceProviderForm}>
                    <form onSubmit={serviceProviderForm.handleSubmit(onServiceProviderSubmit)} className="space-y-4">
                      <MyField
                        form={serviceProviderForm}
                        name="name"
                        label="Full Name"
                        placeholder="Enter your full name"
                        input={(field) => (
                          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
                            <div className="flex items-center justify-center w-10 h-10 text-gray-400">
                              <User size={20} />
                            </div>
                            <Input
                              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="Enter your full name"
                              {...field}
                            />
                          </div>
                        )}
                      />
                      
                      <MyField
                        form={serviceProviderForm}
                        name="email"
                        label="Email"
                        placeholder="Enter your email"
                        input={(field) => (
                          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
                            <div className="flex items-center justify-center w-10 h-10 text-gray-400">
                              <Mail size={20} />
                            </div>
                            <Input
                              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="Enter your email"
                              {...field}
                            />
                          </div>
                        )}
                      />
                      
                      <MyField
                        form={serviceProviderForm}
                        name="phone"
                        label="Phone Number"
                        placeholder="Enter your phone number"
                        input={(field) => (
                          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
                            <div className="flex items-center justify-center w-10 h-10 text-gray-400">
                              <Phone size={20} />
                            </div>
                            <Input
                              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="Enter your phone number"
                              {...field}
                            />
                          </div>
                        )}
                      />
                      
                      <MyField
                        form={serviceProviderForm}
                        name="profession"
                        label="Profession"
                        placeholder="Select your profession"
                        input={(field) => (
                          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
                            <div className="flex items-center justify-center w-10 h-10 text-gray-400">
                              <Building size={20} />
                            </div>
                            <select
                              className="flex h-10 w-full bg-transparent px-3 py-2 text-sm focus:outline-none"
                              {...field}
                            >
                              <option value="">Select profession</option>
                              <option value="plumber">Plumber</option>
                              <option value="electrician">Electrician</option>
                              <option value="carpenter">Carpenter</option>
                              <option value="cleaner">Cleaner</option>
                              <option value="painter">Painter</option>
                            </select>
                          </div>
                        )}
                      />
                      
                      <MyField
                        form={serviceProviderForm}
                        name="experience"
                        label="Experience (years)"
                        placeholder="Enter years of experience"
                        input={(field) => (
                          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
                            <div className="flex items-center justify-center w-10 h-10 text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                              </svg>
                            </div>
                            <Input
                              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              type="number"
                              placeholder="Enter years of experience"
                              {...field}
                            />
                          </div>
                        )}
                      />
                      
                      <MyField
                        form={serviceProviderForm}
                        name="password"
                        label="Password"
                        placeholder="Create a password"
                        input={(field) => (
                          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
                            <div className="flex items-center justify-center w-10 h-10 text-gray-400">
                              <Lock size={20} />
                            </div>
                            <Input
                              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a password"
                              {...field}
                            />
                            <div 
                              className="flex items-center justify-center w-10 h-10 cursor-pointer text-gray-400"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </div>
                          </div>
                        )}
                      />
                      
                      <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
                        Create Provider Account
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={() => setActiveTab("login")}
                    className="text-green-500 hover:underline"
                  >
                    Login
                  </button>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}