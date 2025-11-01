import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const MessagePage = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [connected, setConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const stompClientRef = useRef(null);
  const selectedContactRef = useRef(null);
  const currentUserRef = useRef(null);
  const chatEndRef = useRef(null);

  const SockJS = window.SockJS;
  const Stomp = window.Stomp;

  useEffect(() => {
    selectedContactRef.current = selectedContact;
  }, [selectedContact]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // Get user info
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser) setCurrentUser(storedUser);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch contacts
  useEffect(() => {
    if (!currentUser) return;
    axios
      .get(`http://localhost:8080/api/messages/contacts/${currentUser.id}`)
      .then((res) => setContacts(res.data))
      .catch((err) => console.error("Error fetching contacts:", err));
  }, [currentUser]);

  // Fetch messages for selected contact
  useEffect(() => {
    if (!selectedContact || !currentUser) return;
    axios
      .get(
        `http://localhost:8080/api/messages/conversation/${currentUser.id}/${selectedContact.id}`
      )
      .then((res) => setMessages(res.data))
      .then(() => {
        setContacts((prev) =>
          prev.map((c) =>
            c.id === selectedContact.id ? { ...c, unread: false } : c
          )
        );
      })
      .catch((err) => console.error("Error fetching conversation:", err));
  }, [selectedContact, currentUser]);

  // WebSocket setup with auto reconnect
  useEffect(() => {
    if (!currentUser) return;

    let client;
    const connect = () => {
      const socket = new SockJS("http://localhost:8080/ws");
      client = Stomp.over(socket);
      stompClientRef.current = client;

      client.connect(
        {},
        () => {
          setConnected(true);
          console.log("✅ Connected to WebSocket");

          client.subscribe("/user/queue/messages", (message) => {
            const received = JSON.parse(message.body);
            console.log("📩 Received:", received);

            // Update contact list
            setContacts((prev) =>
              prev.map((c) =>
                c.id === received.senderId
                  ? {
                      ...c,
                      lastMessage: received.content,
                      unread:
                        !selectedContactRef.current ||
                        c.id !== selectedContactRef.current.id,
                    }
                  : c
              )
            );

            // Append to current conversation if relevant
            if (
              selectedContactRef.current &&
              (received.senderId === selectedContactRef.current.id ||
                received.receiverId === selectedContactRef.current.id)
            ) {
              setMessages((prev) => [...prev, received]);
            }
          });
        },
        (error) => {
          console.error("❌ WebSocket error:", error);
          setTimeout(connect, 3000); // auto reconnect
        }
      );

      socket.onclose = () => {
        console.warn("⚠️ WebSocket closed. Reconnecting...");
        setConnected(false);
        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      if (client && client.connected) {
        client.disconnect(() => console.log("❌ Disconnected"));
      }
    };
  }, [currentUser]);

  // Polling fallback every 5 seconds (for safety)
  useEffect(() => {
    if (!selectedContact || !currentUser) return;
    const interval = setInterval(() => {
      axios
        .get(
          `http://localhost:8080/api/messages/conversation/${currentUser.id}/${selectedContact.id}`
        )
        .then((res) => setMessages(res.data))
        .catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedContact, currentUser]);

  // Send message
  const handleSend = (e) => {
    e.preventDefault();
    if (!content.trim() || !selectedContact || !connected || !currentUser)
      return;

    const messageData = {
      senderId: currentUser.id,
      receiverId: selectedContact.id,
      content,
    };

    stompClientRef.current.send(
      "/app/chat.sendMessage",
      {},
      JSON.stringify(messageData)
    );

    setMessages((prev) => [
      ...prev,
      {
        ...messageData,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      },
    ]);

    setContacts((prev) =>
      prev.map((c) =>
        c.id === selectedContact.id
          ? { ...c, lastMessage: content, unread: false }
          : c
      )
    );
    setContent("");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <div
        className="card shadow-lg"
        style={{ width: "80%", height: "85vh", borderRadius: "20px" }}
      >
        <div className="card-header bg-white border-0">
          <h4 className="fw-bold text-center mb-0">💬 Messages</h4>
        </div>

        <div className="card-body d-flex" style={{ overflow: "hidden" }}>
          {/* Contacts */}
          <div
            className="border-end pe-3"
            style={{ width: "25%", overflowY: "auto" }}
          >
            <h6 className="fw-bold mb-3">Contacts</h6>
            {contacts.length === 0 && <p>No contacts yet.</p>}
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-2 mb-2 rounded-3 ${
                  selectedContact?.id === contact.id
                    ? "bg-primary text-white"
                    : "bg-light"
                }`}
                style={{ cursor: "pointer", position: "relative" }}
                onClick={() => setSelectedContact(contact)}
              >
                <strong>{contact.username}</strong>
                <br />
                <small className="text-muted">
                  {contact.lastMessage
                    ? contact.lastMessage.slice(0, 25) + "..."
                    : contact.department}
                </small>
                {contact.unread && (
                  <span
                    className="badge bg-danger position-absolute top-0 end-0"
                    style={{ fontSize: "0.6rem" }}
                  >
                    ●
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Chat Area */}
          <div className="flex-grow-1 d-flex flex-column ps-3">
            {selectedContact ? (
              <>
                <div className="border-bottom pb-2 mb-2">
                  <h6 className="fw-bold">
                    Chat with {selectedContact.username}
                  </h6>
                </div>

                <div
                  className="flex-grow-1 overflow-auto mb-3"
                  style={{
                    backgroundColor: "#f0f2f5",
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                >
                  {messages.length === 0 ? (
                    <p className="text-center text-muted mt-3">
                      No messages yet.
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`d-flex mb-2 ${
                          msg.senderId === currentUser?.id
                            ? "justify-content-end"
                            : "justify-content-start"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-3 ${
                            msg.senderId === currentUser?.id
                              ? "bg-primary text-white"
                              : "bg-white border"
                          }`}
                          style={{ maxWidth: "70%" }}
                        >
                          {msg.content}
                          <div>
                            <small className="text-muted ms-2">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </small>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form
                  onSubmit={handleSend}
                  className="d-flex border-top pt-2"
                  style={{ gap: "8px" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type a message..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary">
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center text-muted my-auto">
                Select a contact to start chatting 💬
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
