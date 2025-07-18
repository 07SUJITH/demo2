import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Code,
  Copy,
  Globe,
  PanelLeft,
  Shield,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import type { EndpointData } from "@/utils/apiEndpointsData";
import {
  getEndpointById,
  getEndpointsByCategory,
} from "@/utils/apiEndpointsData";

// Helper function to get color based on HTTP method
const getMethodColor = (method: string | undefined): string => {
  switch (method?.toLowerCase()) {
    case "get":
      return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700";
    case "post":
      return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700";
    case "put":
      return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700";
    case "delete":
      return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700";
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700";
  }
};

// Helper function to get color based on HTTP status
const getStatusColor = (status: number): string => {
  if (status >= 200 && status < 300)
    return "text-green-600 dark:text-green-400";
  if (status >= 400 && status < 500)
    return "text-orange-600 dark:text-orange-400";
  if (status >= 500) return "text-red-600 dark:text-red-400";
  return "text-blue-600 dark:text-blue-400";
};

// Reusable Code Block Component
interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock = ({ code, language = "json" }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-gray-900 dark:bg-gray-950 text-white p-4 rounded-lg overflow-x-auto text-sm font-mono max-w-full">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        onClick={copyToClipboard}
        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-gray-400" />
        )}
      </Button>
    </div>
  );
};

// Sidebar Component for API Navigation
interface ApiSidebarProps {
  currentEndpointId: string | undefined;
  onItemClick?: () => void;
}

const ApiSidebar = ({ currentEndpointId, onItemClick }: ApiSidebarProps) => {
  const navigate = useNavigate();
  const endpointsByCategory = getEndpointsByCategory();

  const handleNavigate = (id: string) => {
    if (onItemClick) onItemClick();
    navigate(`/endpoint/${id}`);
  };

  return (
    <div className="h-full overflow-y-auto pb-10">
      <Accordion
        type="multiple"
        defaultValue={Object.keys(endpointsByCategory)}
        className="w-full"
      >
        {Object.entries(endpointsByCategory).map(
          ([category, endpoints]: [string, EndpointData[]]) => (
            <AccordionItem value={category} key={category}>
              <AccordionTrigger className="px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:no-underline">
                {category}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1">
                  {endpoints.map((endpoint: EndpointData) => (
                    <li key={endpoint.id}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start h-auto  text-left ${
                          currentEndpointId === endpoint.id
                            ? "bg-gray-100 dark:bg-gray-800"
                            : ""
                        }`}
                        onClick={() => handleNavigate(endpoint.id)}
                      >
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {endpoint.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                            {endpoint.method} {endpoint.url}
                          </span>
                        </div>
                      </Button>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )
        )}
      </Accordion>
    </div>
  );
};

// Main Endpoint Detail Page Component
export default function EndpointDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const [activeTab, setActiveTab] = useState("documentation");

  const mainContentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const endpoint: EndpointData | null = id ? getEndpointById(id) : null;

  // FIX: Using IntersectionObserver for more reliable sticky tabs detection
  useEffect(() => {
    console.log(`[DEBUG] Setting up sticky tabs for endpoint: ${id}`);

    // 1. Explicitly reset the sticky state.
    setIsTabsSticky(false);

    const mainContent = mainContentRef.current;
    const header = headerRef.current;

    // 2. Scroll the main content area to the top instantly.
    if (mainContent) {
      mainContent.scrollTop = 0;
    }

    if (!header || !mainContent) {
      console.log("[DEBUG] Header or main content ref not available yet");
      return;
    }

    let observer: IntersectionObserver | null = null;
    const timeoutIds: NodeJS.Timeout[] = [];

    const setupIntersectionObserver = () => {
      if (observer || !headerRef.current || !mainContentRef.current) return;

      console.log("[DEBUG] Setting up IntersectionObserver");

      // Create intersection observer to watch when header goes out of view
      observer = new IntersectionObserver(
        entries => {
          const entry = entries[0];
          // When header is not intersecting (out of view), make tabs sticky
          const shouldStick =
            !entry.isIntersecting && entry.boundingClientRect.top < 0;
          console.log(
            `[DEBUG] Header intersecting: ${entry.isIntersecting}, shouldStick: ${shouldStick}`
          );
          setIsTabsSticky(shouldStick);
        },
        {
          root: mainContentRef.current,
          rootMargin: "-64px 0px 0px 0px", // Account for the 64px header
          threshold: 0,
        }
      );

      observer.observe(headerRef.current);
    };

    // Wait for DOM to be ready with multiple strategies
    const checkAndSetup = () => {
      if (!headerRef.current || !mainContentRef.current) {
        console.log("[DEBUG] Refs not ready, retrying...");
        return false;
      }

      const headerRect = headerRef.current.getBoundingClientRect();
      if (headerRect.height === 0) {
        console.log("[DEBUG] Header has no height, retrying...");
        return false;
      }

      setupIntersectionObserver();
      return true;
    };

    // Try multiple times with increasing delays
    [0, 50, 100, 200, 500].forEach(delay => {
      const timeout = setTimeout(() => {
        if (!observer) {
          checkAndSetup();
        }
      }, delay);
      timeoutIds.push(timeout);
    });

    // Cleanup function
    return () => {
      console.log("[DEBUG] Cleaning up sticky tabs observer");
      timeoutIds.forEach(clearTimeout);
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    };
  }, [id]); // This effect correctly depends on 'id' to re-run on navigation.

  if (!endpoint) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center text-center p-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Endpoint Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The API endpoint you are looking for does not exist.
          </p>
          <Button onClick={() => navigate("/#api-docs")}>
            <ArrowLeft className="w-3 h-3 mr-2" />
            Back to Documentation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="h-screen bg-gray-50 dark:bg-gray-950 flex overflow-hidden"
      >
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-72 h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              API Endpoints
            </h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <ApiSidebar currentEndpointId={id} />
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <header className="flex-shrink-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-20">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                  {/* Mobile Sidebar Trigger */}
                  <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    <SheetTrigger asChild className="lg:hidden">
                      <Button variant="ghost" size="icon">
                        <PanelLeft className="w-4 h-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 p-0 max-w-full">
                      <SheetHeader className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <SheetTitle>API Endpoints</SheetTitle>
                      </SheetHeader>
                      <ApiSidebar
                        currentEndpointId={id}
                        onItemClick={() => setIsSidebarOpen(false)}
                      />
                    </SheetContent>
                  </Sheet>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/#api-docs")}
                  >
                    <ArrowLeft className="w-3 h-3 mr-2" />
                    Back to Docs
                  </Button>
                </div>
                <ThemeToggleButton />
              </div>
            </div>
          </header>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Sticky Tabs */}
            {isTabsSticky && (
              <div className="flex-shrink-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-10 px-4 sm:px-6 lg:px-8 py-2">
                <TabsList className="flex w-full overflow-x-auto bg-gray-100 dark:bg-gray-800">
                  <TabsTrigger value="documentation" className="truncate">
                    Documentation
                  </TabsTrigger>
                  <TabsTrigger value="request" className="truncate">
                    Request
                  </TabsTrigger>
                  <TabsTrigger value="responses" className="truncate">
                    Responses
                  </TabsTrigger>
                  <TabsTrigger value="details" className="truncate">
                    Details
                  </TabsTrigger>
                </TabsList>
              </div>
            )}

            {/* Main Content - Scrollable */}
            <main
              id="main-content"
              ref={mainContentRef}
              className="flex-1 overflow-y-auto"
            >
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="space-y-8 max-w-full">
                  {/* Endpoint Header */}
                  <header ref={headerRef} className="max-w-full">
                    <div className="flex items-center space-x-3 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getMethodColor(
                          endpoint.method
                        )}`}
                      >
                        {endpoint.method}
                      </span>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {endpoint.category}
                      </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {endpoint.name}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                      {endpoint.description}
                    </p>
                    <div className="max-w-full overflow-x-auto">
                      <code className="text-sm sm:text-base font-mono bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg text-gray-900 dark:text-gray-100 inline-block break-all">
                        {endpoint.url}
                      </code>
                    </div>
                  </header>

                  {/* Conditionally hide the original tabs to prevent duplicates */}
                  <div
                    ref={tabsRef}
                    className={isTabsSticky ? "invisible" : ""}
                  >
                    <TabsList className="flex w-full mb-6 overflow-x-auto bg-gray-100 dark:bg-gray-800">
                      <TabsTrigger value="documentation" className="truncate">
                        Documentation
                      </TabsTrigger>
                      <TabsTrigger value="request" className="truncate">
                        Request
                      </TabsTrigger>
                      <TabsTrigger value="responses" className="truncate">
                        Responses
                      </TabsTrigger>
                      <TabsTrigger value="details" className="truncate">
                        Details
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Tabs Content */}
                  <TabsContent value="documentation">
                    <Card>
                      <CardHeader>
                        <CardTitle>Full Documentation</CardTitle>
                      </CardHeader>
                      <CardContent className="overflow-x-auto">
                        <div className="prose prose-gray dark:prose-invert prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-white w-full max-w-full overflow-visible break-words">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {endpoint.fullDescription}
                          </ReactMarkdown>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="request">
                    <div className="space-y-6">
                      {endpoint.requestBody && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Request Body</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CodeBlock
                              code={JSON.stringify(
                                endpoint.requestBody.example,
                                null,
                                2
                              )}
                            />
                          </CardContent>
                        </Card>
                      )}
                      {endpoint.pathParams &&
                        endpoint.pathParams.length > 0 && (
                          <Card>
                            <CardHeader>
                              <CardTitle>Path Parameters</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Parameter</TableHead>
                                      <TableHead>Description</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {endpoint.pathParams.map(
                                      (
                                        param: {
                                          key: string;
                                          description: string;
                                        },
                                        i: number
                                      ) => (
                                        <TableRow key={i}>
                                          <TableCell>
                                            <code className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                                              {param.key}
                                            </code>
                                          </TableCell>
                                          <TableCell>
                                            {param.description}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}
                                  </TableBody>
                                </Table>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                    </div>
                  </TabsContent>
                  <TabsContent value="responses">
                    <Card>
                      <CardHeader>
                        <CardTitle>Response Examples</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {endpoint.responseExamples?.map(
                          (
                            example: {
                              status: number;
                              description: string;
                              body: Record<string, unknown>;
                            },
                            index: number
                          ) => (
                            <div key={index} className="max-w-full">
                              <div className="flex items-center space-x-3 mb-3">
                                <span
                                  className={`font-semibold text-sm px-2 py-1 rounded ${getStatusColor(
                                    example.status
                                  )} bg-gray-100 dark:bg-gray-800`}
                                >
                                  {example.status}
                                </span>
                                <span className="text-gray-700 dark:text-gray-300 text-sm">
                                  {example.description}
                                </span>
                              </div>
                              <CodeBlock
                                code={JSON.stringify(example.body, null, 2)}
                              />
                            </div>
                          )
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="details">
                    <Card>
                      <CardHeader>
                        <CardTitle>Technical Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-start space-x-3">
                          <Shield className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              Authentication
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {endpoint.authentication}
                            </p>
                          </div>
                        </div>
                        {endpoint.technicalNotes && (
                          <div className="flex items-start space-x-3">
                            <Code className="w-4 h-4 mt-1 text-purple-500 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                Technical Notes
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {endpoint.technicalNotes}
                              </p>
                            </div>
                          </div>
                        )}
                        {endpoint.relatedEndpoints &&
                          endpoint.relatedEndpoints.length > 0 && (
                            <div className="flex items-start space-x-3">
                              <Globe className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                  Related Endpoints
                                </h4>
                                <ul className="space-y-1">
                                  {endpoint.relatedEndpoints.map(
                                    (ep: string) => (
                                      <li key={ep} className="break-all">
                                        <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-900 dark:text-gray-100">
                                          {ep}
                                        </code>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            </div>
                          )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </div>
            </main>
          </Tabs>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
