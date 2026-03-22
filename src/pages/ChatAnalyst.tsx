import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Sparkles,
  User,
  Code2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSendChat } from "@/hooks/use-api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sql?: string;
  data?: Record<string, unknown>[];
  timestamp: Date;
}

const suggestedQuestions = [
  "What are our top 5 products by revenue?",
  "Show me customer retention trends",
  "Which sales rep has the highest conversion rate?",
  "Compare this month to the same period last year",
];

export default function ChatAnalyst() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [expandedSql, setExpandedSql] = useState<string | null>(null);
  const sendChat = useSendChat();

  const handleSend = async () => {
    if (!input.trim() || sendChat.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const question = input;
    setInput("");

    try {
      const response = await sendChat.mutateAsync(question);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.answer,
        sql: response.sql,
        data: response.data,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "⚠️ Failed to get a response from the server. Please check that your API is running.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Chat Analyst</h1>
              <p className="text-sm text-muted-foreground">
                Ask questions about your business data
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-20">
                <Sparkles className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Start a conversation</h3>
                <p className="text-sm text-muted-foreground">
                  Ask any question about your business data and get AI-powered answers.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-4 animate-fade-up",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-2xl rounded-lg px-4 py-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <div
                    className={cn(
                      "prose prose-sm max-w-none",
                      message.role === "user"
                        ? "prose-invert"
                        : "prose-invert prose-p:text-foreground prose-headings:text-foreground prose-strong:text-foreground"
                    )}
                  >
                    {message.content.split("\n").map((line, i) => (
                      <p key={i} className="mb-2 last:mb-0">
                        {line}
                      </p>
                    ))}
                  </div>

                  {message.sql && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <button
                        onClick={() =>
                          setExpandedSql(expandedSql === message.id ? null : message.id)
                        }
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Code2 className="h-4 w-4" />
                        <span>View SQL Query</span>
                        {expandedSql === message.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      {expandedSql === message.id && (
                        <pre className="mt-2 p-3 bg-background rounded-md text-xs text-muted-foreground overflow-x-auto">
                          <code>{message.sql}</code>
                        </pre>
                      )}
                    </div>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary shrink-0">
                    <User className="h-4 w-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {sendChat.isPending && (
              <div className="flex gap-4 animate-fade-up">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150" />
                    <span className="text-sm ml-2">Analyzing your data...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggested Questions */}
        {messages.length === 0 && (
          <div className="px-6 py-3 border-t border-border bg-background">
            <div className="max-w-4xl mx-auto">
              <p className="text-xs text-muted-foreground mb-2">Suggested questions</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => setInput(question)}
                    className="px-3 py-1.5 text-sm text-muted-foreground bg-muted rounded-full hover:bg-muted/80 hover:text-foreground transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-6 py-4 border-t border-border bg-card/50">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about your business data..."
                className="min-h-[44px] max-h-32 bg-background border-border resize-none"
                rows={1}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || sendChat.isPending}
                className="px-4 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
