import React, { useContext, useState } from "react";
import io from "socket.io-client";
import useSound from "use-sound";
import config from "../../../config";
import LatestMessagesContext from "../../../contexts/LatestMessages/LatestMessages";
import TypingMessage from "./TypingMessage";
import Header from "./Header";
import Footer from "./Footer";
import initialBootyMessage from "../../../common/constants/initialBottyMessage";
import Message from "./Message";
import "../styles/_messages.scss";

const socket = io(config.BOT_SERVER_ENDPOINT, {
    transports: ["websocket", "polling", "flashsocket"],
});

function Messages() {
    const { setLatestMessage } = useContext(LatestMessagesContext);
    const [messages, setMessages] = useState([
        { message: initialBootyMessage },
    ]);
    const [message, setMessage] = useState("");
    const [isTypingMessage, setIsTypingMessage] = useState("");

    const sendMessage = () => {
        setMessages([
            ...messages,
            {
                message,
                user: "me",
            },
        ]);
        setMessage("");
        socket.emit("user-message", "text");
    };

    socket.on("bot-message", (message) => {
        setMessages([
            ...messages,
            {
                message,
            },
        ]);
        setIsTypingMessage("");
    });

    socket.on("bot-typing", () => {
        setIsTypingMessage(
            <Message message={{ message: "(Typing...)" }}></Message>
        );
    });

    return (
        <div className="messages">
            <Header />
            <div className="messages__list" id="message-list">
                {messages.map((msg, i) => (
                    <Message key={`msg${i}`} message={msg}></Message>
                ))}
                {isTypingMessage}
            </div>

            <Footer
                message={message}
                sendMessage={sendMessage}
                onChangeMessage={(e) => setMessage(e.target.value)}
            />
        </div>
    );
}

export default Messages;
