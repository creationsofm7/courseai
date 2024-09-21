"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  PlusIcon,
  VideoIcon,
  ChevronRightIcon,
  PencilIcon,
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  videoUrl: string;
}

interface Module {
  id: string;
  title: string;
  resources: Resource[];
}

interface Course {
  id: string;
  name: string;
  description: string;
  modules: Module[];
}

interface ModuleFormData {
  title: string;
}

interface ResourceFormData {
  title: string;
  videoUrl: string;
}

const CourseInterface = ({ params }: { params: { id: string } }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    type: "module" | "resource";
    id: string;
  } | null>(null);

  const moduleForm = useForm<ModuleFormData>();
  const resourceForm = useForm<ResourceFormData>();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/course?id=${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch course");
        }
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    fetchCourse();
  }, [params.id]);

  const addModule: SubmitHandler<ModuleFormData> = async (data) => {
    try {
      const response = await fetch(`/api/course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: course?.id,
          title: data.title,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add module");
      }

      const newModule = await response.json();
      setCourse((prevCourse) =>
        prevCourse
          ? {
              ...prevCourse,
              modules: [...prevCourse.modules, newModule],
            }
          : null
      );

      setIsModuleDialogOpen(false);
      moduleForm.reset();
    } catch (error) {
      console.error("Error adding module:", error);
    }
  };

  const addResource: SubmitHandler<ResourceFormData> = async (data) => {
    if (activeModule) {
      try {
        const response = await fetch("/api/course", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            moduleId: activeModule,
            title: data.title,
            videoUrl: data.videoUrl,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add resource");
        }

        const newResource = await response.json();
        setCourse((prevCourse) =>
          prevCourse
            ? {
                ...prevCourse,
                modules: prevCourse.modules.map((module) =>
                  module.id === activeModule
                    ? {
                        ...module,
                        resources: [...module.resources, newResource],
                      }
                    : module
                ),
              }
            : null
        );

        setIsResourceDialogOpen(false);
        resourceForm.reset();
      } catch (error) {
        console.error("Error adding resource:", error);
      }
    }
  };

  const editModule: SubmitHandler<ModuleFormData> = async (data) => {
    if (editingItem?.type === "module") {
      try {
        const response = await fetch(`/api/course`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ moduleId: editingItem.id, title: data.title }),
        });

        if (!response.ok) {
          throw new Error("Failed to edit module");
        }

        const updatedModule = await response.json();
        setCourse((prevCourse) =>
          prevCourse
            ? {
                ...prevCourse,
                modules: prevCourse.modules.map((module) =>
                  module.id === editingItem.id ? updatedModule : module
                ),
              }
            : null
        );

        setEditingItem(null);
        setIsModuleDialogOpen(false);
        moduleForm.reset();
      } catch (error) {
        console.error("Error editing module:", error);
      }
    }
  };

  const editResource: SubmitHandler<ResourceFormData> = async (data) => {
    if (editingItem?.type === "resource") {
      try {
        const response = await fetch(`/api/course`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resourceId: editingItem.id,
            title: data.title,
            videoUrl: data.videoUrl,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to edit resource");
        }

        const updatedResource = await response.json();
        setCourse((prevCourse) =>
          prevCourse
            ? {
                ...prevCourse,
                modules: prevCourse.modules.map((module) => ({
                  ...module,
                  resources: module.resources.map((resource) =>
                    resource.id === editingItem.id ? updatedResource : resource
                  ),
                })),
              }
            : null
        );

        setEditingItem(null);
        setIsResourceDialogOpen(false);
        resourceForm.reset();
      } catch (error) {
        console.error("Error editing resource:", error);
      }
    }
  };

  const playVideo = (videoUrl: string) => {
    setCurrentVideo(videoUrl);
  };

  const handleModuleClick = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const handleEditClick = (type: "module" | "resource", id: string) => {
    setEditingItem({ type, id });
    if (type === "module") {
      const module = course?.modules.find((m) => m.id === id);
      if (module) {
        moduleForm.reset({ title: module.title });
      }
      setIsModuleDialogOpen(true);
    } else {
      const resource = course?.modules
        .flatMap((m) => m.resources)
        .find((r) => r.id === id);
      if (resource) {
        resourceForm.reset({
          title: resource.title,
          videoUrl: resource.videoUrl,
        });
      }
      setIsResourceDialogOpen(true);
    }
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row h-screen w-full text-gray-100 font-sans">
        {/* Video Player */}
        <div className="w-full lg:w-3/4 p-6">
          <div className="aspect-w-16 aspect-h-9 h-[50vh] lg:h-[calc(80vh-3rem)] rounded-2xl overflow-hidden shadow-lg bg-black">
            {currentVideo ? (
              <iframe
                src={`https://www.youtube.com/embed/${
                  currentVideo.split("v=")[1]
                }`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a video to play
              </div>
            )}
          </div>
        </div>

        {/* Module Browser */}
        <div className="w-full lg:w-1/4 p-6 bg-gray-900 overflow-y-auto max-h-[50vh] lg:max-h-screen border-l border-gray-700">
          <div className="flex-1  justify-between items-center mb-6">
            <div className="flex items-center mt-2 space-x-2">
              <Switch
                checked={editMode}
                onCheckedChange={setEditMode}
                id="edit-mode"
              />
              <label htmlFor="edit-mode" className="text-sm text-gray-300">
                Edit Mode
              </label>
            </div>
          </div>

          {/* Module list */}
          <div className="space-y-2">
            {course.modules.map((module) => (
              <div
                key={module.id}
                className="border border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="flex items-center justify-between py-3 px-4 bg-gray-750 hover:bg-gray-700 transition-colors duration-200">
                  <button
                    onClick={() => handleModuleClick(module.id)}
                    className="flex-grow text-left"
                  >
                    <span className="text-lg font-medium text-gray-100">
                      {module.title}
                    </span>
                  </button>
                  {editMode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick("module", module.id)}
                      className="ml-2 text-gray-400 "
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  )}
                  <ChevronRightIcon
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      expandedModule === module.id ? "transform rotate-90" : ""
                    }`}
                  />
                </div>
                {expandedModule === module.id && (
                  <div className="p-4 bg-gray-800">
                    {/* Resource list */}
                    <ul className="space-y-2">
                      {module.resources && module.resources.length > 0 ? (
                        module.resources.map((resource) => (
                          <li
                            key={resource?.id || Math.random().toString()}
                            className="flex items-center justify-between"
                          >
                            <Button
                              variant="ghost"
                              onClick={() =>
                                resource?.videoUrl &&
                                playVideo(resource.videoUrl)
                              }
                              className="flex-grow text-left text-sm text-gray-100 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200"
                              disabled={!resource?.videoUrl}
                            >
                              <VideoIcon className="mr-2 h-4 w-4 text-blue-400" />{" "}
                              {resource?.title || "Untitled Resource"}
                            </Button>
                            {editMode && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleEditClick("resource", resource?.id)
                                }
                                className="ml-2 text-gray-400 hover:text-gray-100"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                            )}
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-400">
                          No resources available
                        </li>
                      )}
                    </ul>

                    {/* Add new resource */}
                    {editMode && (
                      <Button
                        onClick={() => {
                          setActiveModule(module.id);
                          setIsResourceDialogOpen(true);
                        }}
                        className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors duration-200"
                      >
                        <PlusIcon className="mr-2 h-4 w-4" /> Add Resource
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add new module */}
          {editMode && (
            <Button
              onClick={() => {
                setEditingItem(null);
                setIsModuleDialogOpen(true);
              }}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg justify-center py-2"
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Add Module
            </Button>
          )}
        </div>
      </div>

      {/* Module Dialog */}
      <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingItem?.type === "module"
                ? "Edit Module"
                : "Add New Module"}
            </DialogTitle>
          </DialogHeader>
          <Form {...moduleForm}>
            <form
              onSubmit={moduleForm.handleSubmit(
                editingItem?.type === "module" ? editModule : addModule
              )}
              className="space-y-4"
            >
              <FormField
                control={moduleForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-300">
                      Module Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter module title"
                        className="bg-gray-700 text-gray-100 border-gray-600 rounded-lg"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 justify-center text-white rounded-lg"
              >
                {editingItem?.type === "module"
                  ? "Update Module"
                  : "Add Module"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Resource Dialog */}
      <Dialog
        open={isResourceDialogOpen}
        onOpenChange={setIsResourceDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingItem?.type === "resource"
                ? "Edit Resource"
                : "Add New Resource"}
            </DialogTitle>
          </DialogHeader>
          <Form {...resourceForm}>
            <form
              onSubmit={resourceForm.handleSubmit(
                editingItem?.type === "resource" ? editResource : addResource
              )}
              className="space-y-4"
            >
              <FormField
                control={resourceForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-300">
                      Resource Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter resource title"
                        className="bg-gray-700 text-gray-100 border-gray-600 rounded-lg"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={resourceForm.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-300">
                      YouTube Video URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter YouTube URL"
                        className="bg-gray-700 text-gray-100 border-gray-600 rounded-lg"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg justify-center"
              >
                {editingItem?.type === "resource"
                  ? "Update Resource"
                  : "Add Resource"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CourseInterface;
