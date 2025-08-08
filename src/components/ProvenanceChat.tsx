import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { cn } from "../utils/cn";
import { useCallback, useEffect, useRef, useState } from "react";
import { LLMService } from "../services/llm.service";
import Markdown from "react-markdown";
import { v4 as uuid } from "uuid";

export function ProvenanceChatContainer() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div
      className={cn(
        "absolute top-0 start-0 w-[35vw] transition-all",
        "h-[95vh]",
        !open && "-translate-x-[35.1vw]"
      )}
    >
      <ProvenanceChat triggerChat={() => setOpen(!open)} />
    </div>
  );
}

interface ProvenaceChatProps {
  readonly triggerChat: () => void;
}
type HistoryMessage = {
  type: "request" | "response";
  content: string;
};

function ProvenanceChat({ triggerChat }: ProvenaceChatProps) {
  const [history, setHistory] = useState<HistoryMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const loadingRef = useRef<boolean>(null);
  const [lastResponse, setLastResponse] = useState<string>("");

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const updateLastResponse = useCallback(
    (delta: string) => {
      if (loadingRef.current === true) {
        setLoading(false);
      }
      setLastResponse((lr) => lr + delta);
    },
    [loading]
  );

  const sendPrompt = (prompt: string) => {
    const newChat: HistoryMessage[] = [
      ...history,
      { type: "request", content: prompt },
    ];
    setHistory([...newChat]);
    setLoading(true);
    new LLMService().sendPrompt(prompt, updateLastResponse).then((r) => {
      setLastResponse("");
      setHistory([...newChat, { type: "response", content: r }]);
    });
  };

  return (
    <div className="relative flex flex-col w-full h-full bg-chat-600 p-2.5 gap-4 rounded-br-2xl">
      <ChatTrigger onClick={triggerChat} />
      <ChatContent
        loading={loading}
        lastResponse={lastResponse}
        history={history}
      />
      <ChatInput onSend={sendPrompt} />
    </div>
  );
}

interface ChatTriggerProps {
  readonly onClick: () => void;
}

function ChatTrigger({ onClick }: ChatTriggerProps) {
  const [flippedIcon, setFlippedIcon] = useState<boolean>(false);

  return (
    <button
      className={cn(
        "absolute flex items-center rounded-r-xl justify-center top-1 -right-7 w-8 h-8 bg-chat-600"
      )}
      onClick={() => {
        onClick();
        setFlippedIcon(!flippedIcon);
      }}
    >
      <FontAwesomeIcon
        color="white"
        icon={faChevronLeft}
        size="sm"
        className={flippedIcon ? "-scale-x-100" : ""}
      />
    </button>
  );
}

interface ChatContentProps {
  readonly history: HistoryMessage[];
  readonly lastResponse: string;
  readonly loading: boolean;
}

function ChatContent({ history, lastResponse, loading }: ChatContentProps) {
  console.log("inside loading: ", loading);
  return (
    <div className="flex flex-col text-sm overflow-y-auto customscrollbar p-3 gap-2 w-full h-[85%] bg-chat-400 rounded-md">
      {history.map((msg) => (
        <div
          key={uuid()}
          className={cn(
            "flex flex-col w-fit",
            msg.type === "request"
              ? "rounded-2xl bg-slate-300 self-end p-3"
              : "justify-start text-white p-2"
          )}
        >
          <Markdown>{msg.content}</Markdown>
        </div>
      ))}
      <p className="flex flex-col w-fit justify-start text-white p-2">
        {loading && "thinking..."}
        {lastResponse && <Markdown>{lastResponse}</Markdown>}
      </p>
    </div>
  );
}

interface ChatInputProps {
  readonly onSend: (msg: string) => void;
}
function ChatInput({ onSend }: ChatInputProps) {
  const [prompt, setPrompt] = useState<string>("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() !== "") {
        onSend(prompt);
        setPrompt("");
      }
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[10%] max-h-[15%] gap-1 py-1 px-1">
      <div className="flex flex-row w-full">
        <textarea
          rows={1}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            "customscrollbar bg-white w-full text-sm rounded-l-2xl",
            "resize-none overflow-y-auto border  rounded-md",
            "px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black",
            "focus:border-transparent leading-6"
          )}
          placeholder="Ask your question about the graph"
        />
      </div>
      <div className="flex flex-row justify-end p-1 ">
        <button className="bg-white flex items-center rounded-full p-2">
          <FontAwesomeIcon size="xs" icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
}
