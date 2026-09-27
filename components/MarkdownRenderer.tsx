import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sanitizeArticleHtml } from "@/lib/sanitize";

interface Props {
  content: string;
  format?: "html" | "markdown";
}

export default function MarkdownRenderer({ content, format = "markdown" }: Props) {
  if (format === "html") {
    return (
      <div
        className="prose-apple"
        dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(content) }}
      />
    );
  }

  return (
    <div className="prose-apple">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
