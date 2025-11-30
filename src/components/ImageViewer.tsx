import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface ImageViewerProps {
  photos: string[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
  canDelete: boolean; // still kept for future use
  onDelete: (index: number) => void; // still kept for future use
}

export default function ImageViewer({
  photos,
  currentIndex,
  setCurrentIndex,
  onClose,
}: ImageViewerProps) {
  
  const [scale, setScale] = useState(1);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();

      if (scale === 1 && e.key === "ArrowRight" && currentIndex < photos.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }

      if (scale === 1 && e.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    };

    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [scale, currentIndex, photos.length, setCurrentIndex, onClose]);


  return (
    <motion.div
      className="fixed inset-0 bg-black/85 flex items-center justify-center z-[999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >

      {/* Close Button Only */}
      <button
        className="absolute top-5 right-6 text-white hover:text-gray-300 transition cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X size={26} />
      </button>


      {/* Left Arrow */}
      {currentIndex > 0 && scale === 1 && (
        <button
          className="absolute left-6 text-white text-3xl cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex(currentIndex - 1);
          }}
        >
          ❮
        </button>
      )}

      {/* Zoom Wrapper */}
      <TransformWrapper
        doubleClick={{ mode: "toggle" }}
        maxScale={4}
        minScale={1}
        wheel={{ disabled: false, step: 0.25, smoothStep: 0.05 }}
        pinch={{ disabled: false }}
        panning={{ disabled: true }}
        onTransformed={(instance) => setScale(instance.state.scale)}
      >
        <TransformComponent>

          <motion.img
            src={photos[currentIndex]}
            className="max-w-[90vw] max-h-[80vh] rounded-xl select-none"
            draggable={false}
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          />

        </TransformComponent>
      </TransformWrapper>


      {/* Right Arrow */}
      {currentIndex < photos.length - 1 && scale === 1 && (
        <button
          className="absolute right-6 text-white text-3xl cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex(currentIndex + 1);
          }}
        >
          ❯
        </button>
      )}

    </motion.div>
  );
}
