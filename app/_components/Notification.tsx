import { Info } from "lucide-react";
import React, { useEffect } from "react";

interface NotificationProps {
  message: string;
  onclose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onclose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onclose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onclose]);

  return (
    <div className="toast-left toast toast-bottom">
      <div className="alert p-2 text-sm shadow-lg">
        <span className="flex items-center">
          <Info className="mr-2 w-4 font-bold text-accent" />
          {message}
        </span>
      </div>
    </div>
  );
};

export default Notification;
