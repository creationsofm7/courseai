"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { Search, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Footer from "@/components/ui/footer";
import { useRouter } from "next/navigation";

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

interface Course {
  id: string; // Assuming course IDs are strings in your database
  name: string;
  description: string;
  progress: number;
}

interface FormValues {
  search: string;
  moduleLength?: string;
  difficultyLevel?: string;
  prerequisites?: string;
  courseCode?: string;
  instructor?: string;
  department?: string;
}

interface HomePageProps {
  username: string | null | undefined;
}

const HomePage: React.FC<HomePageProps> = (props) => {
  const [greeting, setGreeting] = useState<string>("");
  const [showAdvancedOptions, setShowAdvancedOptions] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  const router = useRouter();
  const methods = useForm<FormValues>({
    defaultValues: {
      search: "",
    },
  });

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  useEffect(() => {
    const fetchUserCourses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/courses"); // Adjust the endpoint as necessary
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const courses: Course[] = await response.json();
        setUserCourses(courses);
        console.log("Fetched courses:", courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCourses();
  }, []);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    console.log(data);

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.search,
          description: "A course on " + data.search,
          modules: [
            {
              title: "Introduction to " + data.search,
              resources: [
                {
                  title: "What is " + data.search + "?",
                  videoUrl: "https://www.youtube.com/watch?v=example",
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create course");
      }

      const course = await response.json();
      console.log("Created course:", course);

      // Route to the course page
      router.push(`/courses/${course.id}`);
    } catch (error) {
      console.error("Error creating course:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl text-center font-semibold mb-28 animate-fade-in-down">
          {greeting}, {props.username.split(" ")[0]}.
        </h1>

        <FormProvider {...methods}>
          <Form {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="lg:mb-8 md:mb-4"
            >
              <div className="relative lg:w-4/6 md:w-5/6 ml-auto mr-auto animate-fade-in">
                <FormField
                  control={methods.control}
                  name="search"
                  rules={{
                    required: "This field is required",
                    minLength: {
                      value: 10,
                      message: "Minimum length is 10 characters",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" />
                          <Input
                            {...field}
                            type="text"
                            placeholder="Learn anything..."
                            className="pl-10 pr-12 py-8 text-xl font-semibold transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                          />
                          <Button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2"
                            aria-label="Submit search"
                          >
                            <ArrowRight className="h-5 w-5" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {methods.formState.errors.search && (
                <Alert
                  variant="destructive"
                  className="mt-2 w-4/6 ml-auto mr-auto"
                >
                  <AlertDescription>
                    {methods.formState.errors.search.message}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </Form>

          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="
            flex items-center ml-auto mr-auto
            bg-gradient-to-r from-white to-gray-100
            border border-gray-300
            text-gray-700 font-semibold
            py-2 px-4 rounded-md
            shadow-sm
            transition-all duration-300
            hover:shadow-md hover:from-gray-50 hover:to-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
            relative overflow-hidden
            group
            "
            >
              <span className="relative z-10">Advanced Options</span>
              {showAdvancedOptions ? (
                <ChevronUp className="ml-2 relative z-10" />
              ) : (
                <ChevronDown className="ml-2 relative z-10" />
              )}
              <span
                className="
              absolute top-0 left-0 w-full h-full
              bg-gradient-to-r from-transparent via-white to-transparent
              transform -skew-x-12
              transition-transform duration-1000 ease-out
              opacity-30
              group-hover:translate-x-full
              "
              ></span>
            </Button>
            {showAdvancedOptions && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                <FormField
                  control={methods.control}
                  name="moduleLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Module Length</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select length" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="short">
                            Short (&lt; 4 weeks)
                          </SelectItem>
                          <SelectItem value="medium">
                            Medium (4-8 weeks)
                          </SelectItem>
                          <SelectItem value="long">
                            Long (&gt; 8 weeks)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="difficultyLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="prerequisites"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prerequisites</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select prerequisites" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="basic">Basic knowledge</SelectItem>
                          <SelectItem value="advanced">
                            Advanced knowledge
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="courseCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Code</FormLabel>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter course code"
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="instructor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructor</FormLabel>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter instructor name"
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter department name"
                      />
                    </FormItem>
                  )}
                />
                <div className="col-span-full flex justify-center mt-4">
                  <Button
                    type="submit"
                    className="transition-all duration-300 hover:bg-blue-600 hover:scale-105"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </FormProvider>

        <h2 className="text-2xl font-semibold mb-4 text-center lg:mt-24 md:mt-18 animate-fade-in">
          Your Courses
        </h2>
        <div className="lg:[ml-60 mr-60] md:[ml-2 mr-2] grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {userCourses.length > 0 ? (
            userCourses.map((course) => (
              <Card
                key={course.id}
                className="h-60 transition-all duration-300 hover:shadow-lg hover:scale-105"
                onClick={() => router.push(`/courses/${course.id}`)}
              >
                <CardHeader>
                  <CardTitle>{course.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Description: {course.description}
                  </p>
                  <Progress value={course.progress} className="mt-4" />
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-600">No courses found</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
