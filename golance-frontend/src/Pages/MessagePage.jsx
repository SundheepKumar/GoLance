import React, { useState, useEffect } from "react";
import axios from "axios";

const MessagePage = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  
  // 🚀 Change this to the logged-in user’s ID dynamically
  const currentUserId = 20; 

  // ✅ Fetch contacts on mount
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/messages/contacts/${currentUserId}`)
      .then((res) => setContacts(res.data))
      .catch((err) => console.error("Error fetching contacts:", err));
  }, []);

  // ✅ Fetch conversation when contact selected
  useEffect(() => {
    if (!selectedContact) return;

    axios
      .get(
        `http://localhost:8080/api/messages/conversation/${currentUserId}/${selectedContact.id}`
      )
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error fetching conversation:", err));
  }, [selectedContact]);

  // ✅ Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim() || !selectedContact) return;

    const messageData = {
      senderId: currentUserId,
      receiverId: selectedContact.id,
      content: content,
    };

    try {
      const res = await axios.post(
        "http://localhost:8080/api/messages/send",
        messageData
      );
      setMessages((prev) => [...prev, res.data]);
      setContent("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
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
          {/* 🧑‍🤝‍🧑 Contacts list */}
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
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedContact(contact)}
              >
                <strong>{contact.username}</strong>
                <br />
                <small className="text-muted">{contact.department}</small>
              </div>
            ))}
          </div>

          {/* 💬 Chat area */}
          <div className="flex-grow-1 d-flex flex-column ps-3">
            {selectedContact ? (
              <>
                {/* Contact name */}
                <div className="border-bottom pb-2 mb-2">
                  <h6 className="fw-bold">
                    Chat with {selectedContact.username}
                  </h6>
                </div>

                {/* Messages */}
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
                          msg.senderId === currentUserId
                            ? "justify-content-end"
                            : "justify-content-start"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-3 ${
                            msg.senderId === currentUserId
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
                </div>

                {/* Message input */}
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
