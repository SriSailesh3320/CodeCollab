import React, { useEffect, useRef, useState, useCallback } from "react";
import Client from "./Client";
import Editor from "./Editor";
import { initSocket } from "../Socket";
import { ACTIONS } from "../Actions";
import { useNavigate, useLocation, Navigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

// If your backend expects specific identifiers, ensure these match.
const LANGUAGES = [
  "python3",
  "javascript",
  "java",
  "cpp",
  "c",
  "csharp",
  "go",
  "rust",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "typescript",
  "bash",
  "sql",
  "r",
];

function EditorPage() {
  // ALL HOOKS MUST BE CALLED FIRST - BEFORE ANY CONDITIONAL LOGIC
  const [clients, setClients] = useState([]);
  const [output, setOutput] = useState("");
  const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("python3");

  const codeRef = useRef("");
  const socketRef = useRef(null);
  const initializedRef = useRef(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();

  const username = location.state?.username;

  // useEffect MUST be called every render - put conditional logic inside
  useEffect(() => {
    // Handle missing username case inside the effect
    if (!username) {
      toast.error("Please enter a username to join a room.");
      navigate("/");
      return;
    }

    // prevent double init in React 18 Strict Mode development
    if (initializedRef.current) return;
    initializedRef.current = true;

    const handleErrors = (err) => {
      console.error("Socket error:", err);
      toast.error("Socket connection failed. Please try again.");
      navigate("/");
    };

    const init = async () => {
      try {
        socketRef.current = await initSocket();

        socketRef.current.on("connect_error", handleErrors);
        socketRef.current.on("connect_failed", handleErrors);

        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          username,
        });

        socketRef.current.on(
          ACTIONS.JOINED,
          ({ clients: joinedClients, username: joinedUser, socketId }) => {
            if (joinedUser && joinedUser !== username) {
              toast.success(`${joinedUser} joined the room.`);
            }
            setClients(joinedClients || []);

            // Sync current code to the newly joined client
            socketRef.current.emit(ACTIONS.SYNC_CODE, {
              code: codeRef.current || "",
              socketId,
            });
          }
        );

        socketRef.current.on(
          ACTIONS.DISCONNECTED,
          ({ socketId, username: leftUser }) => {
            if (leftUser) toast.success(`${leftUser} left the room`);
            setClients((prev) => prev.filter((c) => c.socketId !== socketId));
          }
        );
      } catch (e) {
        handleErrors(e);
      }
    };

    init();

    return () => {
      try {
        if (socketRef.current) {
          socketRef.current.off("connect_error", handleErrors);
          socketRef.current.off("connect_failed", handleErrors);
          socketRef.current.off(ACTIONS.JOINED);
          socketRef.current.off(ACTIONS.DISCONNECTED);
          socketRef.current.disconnect();
        }
      } finally {
        initializedRef.current = false;
      }
    };
  }, [navigate, roomId, username]);

  // ALL useCallback hooks MUST be called every render
  const copyRoomId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied");
    } catch (error) {
      console.error(error);
      toast.error("Unable to copy the Room ID");
    }
  }, [roomId]);

  const leaveRoom = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const runCode = useCallback(async () => {
    setIsCompiling(true);
    setOutput("");
    try {
      const response = await axios.post("https://codecollab-9hu9.onrender.com/compile", {
        code: codeRef.current || "",
        language: selectedLanguage,
        stdin: "",
      });
      const out =
        typeof response.data === "string"
          ? response.data
          : response.data?.output || JSON.stringify(response.data, null, 2);
      setOutput(out);
    } catch (error) {
      console.error("Error compiling code:", error);
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "An error occurred";
      setOutput(message);
    } finally {
      setIsCompiling(false);
    }
  }, [selectedLanguage]);

  const toggleCompileWindow = useCallback(() => {
    setIsCompileWindowOpen((v) => !v);
  }, []);

  // NOW we can do conditional rendering - after all hooks are called
  if (!username) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      <div className="row flex-grow-1">
        {/* Client panel */}
        <div className="col-md-2 bg-dark text-light d-flex flex-column gap-4">
          <img
            src="/images/codecast.png"
            alt="Logo"
            className="img-fluid mx-auto d-block mt-3"
          />
          <hr style={{ marginTop: "1rem" }} />

          {/* Client list container */}
          <div className="d-flex flex-column flex-grow-1 overflow-auto px-2">
            <span className="mb-2">Members</span>
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>

          <hr />
          {/* Buttons */}
          <div className="mt-auto mb-3 px-2">
            <button className="btn btn-success w-100 mb-2" onClick={copyRoomId}>
              Copy Room ID
            </button>
            <button className="btn btn-danger w-100" onClick={leaveRoom}>
              Leave Room
            </button>
          </div>
        </div>

        {/* Editor panel */}
        <div className="col-md-10 text-light d-flex flex-column mt-2">
          {/* Toolbar */}
          <div className="bg-dark p-2 d-flex gap-2 align-items-center">
            <select
              className="form-select w-auto"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              aria-label="Select language"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="btn btn-primary"
              onClick={runCode}
              disabled={isCompiling}
            >
              {isCompiling ? "Running..." : "Run"}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={toggleCompileWindow}
            >
              {isCompileWindowOpen ? "Hide Output" : "Show Output"}
            </button>
          </div>

          {/* Editor */}
          <div className="flex-grow-1 d-flex">
            <div className="flex-grow-1">
              <Editor
                socketRef={socketRef}
                roomId={roomId}
                onCodeChange={(code) => {
                  codeRef.current = code;
                }}
              />
            </div>

            {/* Optional side output panel when open */}
            {isCompileWindowOpen && (
              <div
                className="bg-dark border-start border-secondary p-2"
                style={{ width: "35%", overflow: "auto" }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>Output</strong>
                  <button
                    className="btn btn-sm btn-outline-light"
                    onClick={() => setOutput("")}
                  >
                    Clear
                  </button>
                </div>
                <pre
                  className="text-light"
                  style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  {output || "No output yet."}
                </pre>
              </div>
            )}
          </div>

          {/* Inline output area when panel is closed */}
          {!isCompileWindowOpen && (
            <div
              className="bg-dark border-top border-secondary p-2"
              style={{ minHeight: "120px" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Output</strong>
                <button
                  className="btn btn-sm btn-outline-light"
                  onClick={() => setOutput("")}
                >
                  Clear
                </button>
              </div>
              <pre
                className="text-light"
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  margin: 0,
                }}
              >
                {output || "No output yet."}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditorPage;
