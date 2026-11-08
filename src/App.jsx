import { BrowserRouter } from "react-router-dom";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { CyberCursor } from "@/components/ui/CyberCursor";
import { FloatingBackToTop } from "@/components/ui/FloatingControls";
import { NeonScrollProgress } from "@/components/ui/NeonScrollProgress";
import { PreloaderGate } from "@/components/ui/PreloaderGate";
import { ToastProvider } from "@/context/ToastContext";
import { AppRoutes } from "@/routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScrollProvider>
        <ToastProvider>
          <CyberCursor />
          <PreloaderGate />
          <NeonScrollProgress />
          <AppRoutes />
          <FloatingBackToTop />
        </ToastProvider>
      </SmoothScrollProvider>
    </BrowserRouter>
  );
}
