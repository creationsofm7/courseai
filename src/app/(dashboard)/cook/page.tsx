// // "use client";

// // import React, { useState } from "react";
// // import { Button } from "@/components/ui/button";

// // interface Topic {
// //   id: number;
// //   name: string;
// //   searchSentence: string;
// // }

// // interface Module {
// //   id: number;
// //   name: string;
// //   topics: Topic[];
// // }

// // const modules: Module[] = [
// //   {
// //     id: 1,
// //     name: "Machine Learning Basics",
// //     topics: [
// //       { id: 1, name: "Introduction to Machine Learning", searchSentence: "Introduction to Machine Learning" },
// //       { id: 2, name: "Types of Machine Learning", searchSentence: "Types of Machine Learning" },
// //       { id: 3, name: "Supervised vs Unsupervised Learning", searchSentence: "Supervised vs Unsupervised Learning" },
// //     ],
// //   },
// //   {
// //     id: 2,
// //     name: "Data Preparation",
// //     topics: [
// //       { id: 4, name: "Data Cleaning", searchSentence: "Data Cleaning techniques" },
// //       { id: 5, name: "Feature Selection", searchSentence: "Feature selection in Machine Learning" },
// //       { id: 6, name: "Data Normalization", searchSentence: "Data normalization techniques" },
// //     ],
// //   },
// //   {
// //     id: 3,
// //     name: "Core Algorithms",
// //     topics: [
// //       { id: 7, name: "Linear Regression", searchSentence: "Linear Regression explained" },
// //       { id: 8, name: "Decision Trees", searchSentence: "Decision Trees Machine Learning" },
// //       { id: 9, name: "K-Means Clustering", searchSentence: "K-Means Clustering explained" },
// //     ],
// //   },
// //   {
// //     id: 4,
// //     name: "Model Evaluation",
// //     topics: [
// //       { id: 10, name: "Confusion Matrix", searchSentence: "Confusion Matrix in Machine Learning" },
// //       { id: 11, name: "Overfitting and Underfitting", searchSentence: "Overfitting versus Underfitting" },
// //       { id: 12, name: "Cross-Validation", searchSentence: "Cross-Validation in Machine Learning" },
// //     ],
// //   },
// //   {
// //     id: 5,
// //     name: "Advanced Topics",
// //     topics: [
// //       { id: 13, name: "Neural Networks", searchSentence: "Neural Networks explained" },
// //       { id: 14, name: "Support Vector Machines", searchSentence: "Support Vector Machines tutorial" },
// //       { id: 15, name: "Natural Language Processing", searchSentence: "Introduction to Natural Language Processing" },
// //     ],
// //   },
// // ];

// // const TopicSelector: React.FC<{
// //   topic: Topic;
// //   isSelected: boolean;
// //   onToggle: (id: number) => void;
// // }> = ({ topic, isSelected, onToggle }) => {
// //   return (
// //     <div
// //       className={`
// //         w-full h-16 
// //         rounded-lg 
// //         border-2 
// //         flex items-center justify-center 
// //         cursor-pointer 
// //         transition-colors duration-200
// //         ${
// //           isSelected
// //             ? "bg-indigo-100 border-indigo-500"
// //             : "bg-white border-gray-300 hover:bg-gray-50"
// //         }
// //       `}
// //       onClick={() => onToggle(topic.id)}
// //     >
// //       <span
// //         className={`text-md font-semibold ${
// //           isSelected ? "text-indigo-700" : "text-gray-700"
// //         }`}
// //       >
// //         {topic.name}
// //       </span>
// //     </div>
// //   );
// // };

// // const ModuleSection: React.FC<{
// //   module: Module;
// //   selectedTopics: number[];
// //   onToggle: (id: number) => void;
// // }> = ({ module, selectedTopics, onToggle }) => {
// //   return (
// //     <div className="mb-8 ml-32 mr-32">
// //       <h2 className="text-3xl font-bold mb-4 pl-2 text-left">{module.name}</h2>
// //       <div className="grid grid-cols-1  gap-4">
// //         {module.topics.map((topic) => (
// //           <TopicSelector
// //             key={topic.id}
// //             topic={topic}
// //             isSelected={selectedTopics.includes(topic.id)}
// //             onToggle={onToggle}
// //           />
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // const TopicSelectionPage: React.FC = () => {
// //   const [selectedTopics, setSelectedTopics] = useState<number[]>([]);

// //   const toggleTopic = (id: number) => {
// //     setSelectedTopics((prev) =>
// //       prev.includes(id)
// //         ? prev.filter((topicId) => topicId !== id)
// //         : [...prev, id]
// //     );
// //   };

// //   const handleConfirm = () => {
// //     const selectedModulesAndTopics = modules.reduce((acc, module) => {
// //       const selectedModuleTopics = module.topics.filter((topic) =>
// //         selectedTopics.includes(topic.id)
// //       );
// //       if (selectedModuleTopics.length > 0) {
// //         acc[module.name] = selectedModuleTopics.map((topic) => topic.name);
// //       }
// //       return acc;
// //     }, {} as Record<string, string[]>);

// //     console.log("Selected modules and topics:");
// //     console.log(selectedModulesAndTopics);
// //   };

// //   return (
// //     <div className="p-6 space-y-6 text-center">
// //       <h1 className="text-3xl font-bold mb-8 text-left">Select Topics</h1>
// //       {modules.map((module) => (
// //         <ModuleSection
// //           key={module.id}
// //           module={module}
// //           selectedTopics={selectedTopics}
// //           onToggle={toggleTopic}
// //         />
// //       ))}
// //       <Button onClick={handleConfirm} className="mt-8 ">
// //         Confirm your selection
// //       </Button>
// //     </div>
// //   );
// // };

// // export default TopicSelectionPage;



// // //adding language support
// // // hello user with voice on login good morning mudit



// "use client"
// import React, { useState, useEffect } from 'react';
// import { Card, CardHeader, CardContent } from '@/components/ui/card';
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
// import { OpenAI } from 'openai';



// const ModuleList = () => {
//   const [modules, setModules] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchModules = async () => {
//       try {
//         const openai = new OpenAI({
//           apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
//         }); // You'll need to install the openai package
//         const response = await openai.chat.completions.create({
//           model: "gpt-4o-mini",
//           messages: [
//             {
//               "role": "system",
//               "content": [
//                 {
//                   "type": "text",
//                   "text": "a course module in the respective format and hierarchy \nmodules \n    \\ topics ? resources\n\n \n\nreturn it in this format\n\nconst modules: Module[] = [\r\n  {\r\n    id: 1,\r\n    name: \"Machine Learning Basics\",\r\n    topics: [\r\n      { id: 1, name: \"Introduction to Machine Learning\", searchSentence: \"Introduction to Machine Learning\" },\r\n      { id: 2, name: \"Types of Machine Learning\", searchSentence: \"Types of Machine Learning\" },\r\n      { id: 3, name: \"Supervised vs Unsupervised Learning\", searchSentence: \"Supervised vs Unsupervised Learning\" },\r\n    ],\r\n  },\r\n  // ... other modules ...\r\n];\n\nas an json api response"
//                 }
//               ]
//             },
//             {
//               "role": "user",
//               "content": [
//                 {
//                   "type": "text",
//                   "text": "cinematography"
//                 }
//               ]
//             }
//           ],
//           temperature: 1,
//           max_tokens: 1571,
//           top_p: 1,
//           frequency_penalty: 0,
//           presence_penalty: 0,
//           response_format: {
//             "type": "json_object"
//           },
//         });

        

//         const data = JSON.parse(response.choices[0].message.content);
//         setModules(data.modules);
//         setLoading(false);
//         console.log(data);
//       } catch (err) {
//         setError('Failed to fetch modules');
//         console.log(err);
//         setLoading(false);
//       }
//     };

//     fetchModules();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <Card className="w-full max-w-3xl mx-auto">
//       <CardHeader>
//         <h2 className="text-2xl font-bold">Course Modules</h2>
//       </CardHeader>
//       <CardContent>
//         <Accordion type="single" collapsible className="w-full">
//           {modules.map((module) => (
//             <AccordionItem key={module.id} value={`item-${module.id}`}>
//               <AccordionTrigger>{module.name}</AccordionTrigger>
//               <AccordionContent>
//                 <ul className="list-disc pl-6">
//                   {module.topics.map((topic) => (
//                     <li key={topic.id}>{topic.name}</li>
//                   ))}
//                 </ul>
//               </AccordionContent>
//             </AccordionItem>
//           ))}
//         </Accordion>
//       </CardContent>
//     </Card>
//   );
// };

// export default ModuleList;