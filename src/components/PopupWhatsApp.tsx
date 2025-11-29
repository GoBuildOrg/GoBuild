import React, { useState } from "react";

type PopupWhatsAppProps = {
  phoneNumber: string;
  message?: string;
};

const PopupWhatsApp: React.FC<PopupWhatsAppProps> = ({
  phoneNumber,
  message = "Hello GoBuild! I need some information regarding your services.",
}) => {
  const [open, setOpen] = useState(false);

  const whatsappLink = `https://wa.me/${918899310111}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#25D366",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          zIndex: 9999,
          animation: "bounce 1.5s infinite",
          transition: "0.3s ease",
        }}
      >
        {/* WhatsApp icon when closed */}
        {!open && (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="whatsapp"
            style={{ width: "32px", height: "32px" }}
          />
        )}

        {/* DOWN ARROW when popup is open */}
        {open && (
  <img
    src="https://cdn-icons-png.flaticon.com/512/2985/2985150.png"
    alt="down arrow"
    style={{
      width: "26px",
      height: "26px",
      filter: "brightness(0) invert(1)", // forces clean white
    }}
  />
)}

      </div>

      {/* Popup */}
      <div
        style={{
          position: "fixed",
          bottom: open ? "100px" : "-300px",
          right: "20px",
          width: "260px",
          background: "white",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          zIndex: 999,
          transition: "bottom 0.35s ease",
        }}
      >
        <p style={{ fontWeight: "bold", marginBottom: "4px" }}>Hi there!</p>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#25D366",
            color: "white",
            padding: "10px 16px",
            borderRadius: "8px",
            textDecoration: "none",
            justifyContent: "center",
            fontSize: "14px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            style={{ width: "20px" }}
          />
          Chat with us
        </a>
      </div>

      {/* Bounce Animation */}
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}
      </style>
    </>
  );
};

export default PopupWhatsApp;
