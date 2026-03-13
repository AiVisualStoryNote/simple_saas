"use client";

import { Button } from "@/components/ui/button";
import { Video, VideoOff } from "lucide-react";
import { useReadingPreferences } from "@/stores/reading-preferences";
import { useEffect, useState } from "react";

const DynamicVideoSwitch = () => {
  const { isDynamicVideoEnabled, toggleDynamicVideo } = useReadingPreferences();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleDynamicVideo}
      className={`focus-visible:ring-0 focus-visible:ring-offset-0 ${
        isDynamicVideoEnabled
          ? "text-primary"
          : "text-muted-foreground"
      }`}
      title={isDynamicVideoEnabled ? "Dynamic Video On" : "Dynamic Video Off"}
    >
      {isDynamicVideoEnabled ? (
        <Video size={16} />
      ) : (
        <VideoOff size={16} />
      )}
    </Button>
  );
};

export { DynamicVideoSwitch };
