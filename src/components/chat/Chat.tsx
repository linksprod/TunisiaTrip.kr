
import React from "react";
import { ChatButton } from "./ChatButton";
import { ChatDialog } from "./ChatDialog";

export default function Chat() {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
    };

    window.addEventListener('openChat', handleOpenChat);
    return () => window.removeEventListener('openChat', handleOpenChat);
  }, []);

  return (
    <>
      <ChatButton isOpen={isOpen} setIsOpen={setIsOpen} />
      <ChatDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
