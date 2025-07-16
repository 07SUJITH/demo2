import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Code,
  Copy,
  Database,
  Globe,
  Shield,
} from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import ThemeToggleButton from "@/components/ui/theme-toggle-button";

import { Button } from "../../components/ui/button";
import { getApiEndpoints, getEndpointById } from "../../utils/apiEndpointsData";

export default function EndpointDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const endpointsList = getApiEndpoints();
  const currentIndex = endpointsList.findIndex(e => e.id === id);
  const prevEndpoint =
    currentIndex > 0 ? endpointsList[currentIndex - 1] : null;
  const nextEndpoint =
    currentIndex >= 0 && currentIndex < endpointsList.length - 1
      ? endpointsList[currentIndex + 1]
      : null;
  const [copied, setCopied] = React.useState<string | null>(null);

  const endpoint = id ? getEndpointById(id) : null;

  // Scroll to top whenever the route param (endpoint id) changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!endpoint) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Endpoint Not Found
          </h1>
          <Button onClick={() => navigate("/#api-docs")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case "get":
        return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
      case "post":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "put":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "delete":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300)
      return "text-green-600 dark:text-green-400";
    if (status >= 400 && status < 500) return "text-red-600 dark:text-red-400";
    if (status >= 500) return "text-red-800 dark:text-red-600";
    return "text-blue-600 dark:text-blue-400";
  };

  const renderCodeBlock = (code: string, language: string = "json") => (
    <div className="relative">
      <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
      <button
        onClick={() => copyToClipboard(code, language)}
        className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
      >
        {copied === language ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-gray-400" />
        )}
      </button>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="min-h-screen bg-gray-50 dark:bg-gray-900"
      >
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/#api-docs")}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Documentation
                </Button>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {endpoint.category}
                </span>
              </div>
              <ThemeToggleButton />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Endpoint Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getMethodColor(endpoint.method)}`}
              >
                {endpoint.method}
              </span>
              <code className="text-lg font-mono bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg text-gray-900 dark:text-gray-100">
                {endpoint.url}
              </code>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {endpoint.name}
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {endpoint.description}
            </p>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Authentication
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {endpoint.authentication}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Category
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {endpoint.category}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Code className="w-5 h-5 text-purple-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Content Type
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  application/json
                </p>
              </div>
            </div>
          </div>

          {/* Request Section */}
          {endpoint.requestBody && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Database className="w-6 h-6 mr-2" />
                Request Body
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Format: {endpoint.requestBody.type}
                  </p>
                  {endpoint.requestBody.example && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Example:
                      </h3>
                      {renderCodeBlock(
                        JSON.stringify(endpoint.requestBody.example, null, 2)
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Headers Section */}
          {endpoint.headers && endpoint.headers.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Headers
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Header
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoint.headers.map((header, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : ""
                        }
                      >
                        <td className="py-3 px-4 font-mono text-sm text-gray-900 dark:text-gray-100">
                          {header.key}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                          {header.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Response Section */}
          {endpoint.responseExamples &&
            endpoint.responseExamples.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Response Examples
                </h2>

                <div className="space-y-6">
                  {endpoint.responseExamples.map((response, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <span
                          className={`font-semibold ${getStatusColor(response.status)}`}
                        >
                          {response.status}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {response.description}
                        </span>
                      </div>
                      {response.body &&
                        Object.keys(response.body).length > 0 &&
                        renderCodeBlock(JSON.stringify(response.body, null, 2))}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Navigation between endpoints */}
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="outline"
              size="sm"
              disabled={!prevEndpoint}
              onClick={() =>
                prevEndpoint && navigate(`/endpoint/${prevEndpoint.id}`)
              }
            >
              ◀ Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!nextEndpoint}
              onClick={() =>
                nextEndpoint && navigate(`/endpoint/${nextEndpoint.id}`)
              }
            >
              Next ▶
            </Button>
          </div>

          {/* Full Description */}
          {endpoint.fullDescription && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Full Documentation
              </h2>

              <div className="prose prose-gray dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-normal">
                  {endpoint.fullDescription}
                </pre>
              </div>
            </div>
          )}
          {/* End main content container */}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
