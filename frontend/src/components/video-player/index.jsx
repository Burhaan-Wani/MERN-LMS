import "media-chrome";
import { useRef, useEffect } from "react";

export default function VideoPlayer({ width = "100%", height = "100%", url }) {
    const mediaControllerRef = useRef(null);

    useEffect(() => {
        const controller = mediaControllerRef.current;

        const fullscreenButton = controller?.querySelector(
            "media-fullscreen-button"
        );

        const handleFullscreenToggle = () => {
            if (!document.fullscreenElement) {
                controller?.requestFullscreen?.();
            } else {
                document.exitFullscreen?.();
            }
        };

        fullscreenButton?.addEventListener("click", handleFullscreenToggle);

        return () => {
            fullscreenButton?.removeEventListener(
                "click",
                handleFullscreenToggle
            );
        };
    }, []);

    return (
        <div
            className="bg-black"
            style={{
                width,
                height,
            }}
        >
            <media-controller
                ref={mediaControllerRef}
                className="block w-full h-full bg-black relative"
                style={{
                    "--media-object-fit": "contain",
                }}
            >
                <video
                    slot="media"
                    src={url}
                    className="w-full h-full object-contain"
                ></video>

                <media-control-bar className="absolute bottom-0 left-0 right-0 z-10 bg-black/70 px-4 py-2 flex items-center justify-between gap-4 backdrop-blur-md border-t border-white/10">
                    {/* Left Controls */}
                    <div className="flex items-center gap-3">
                        <media-play-button className="w-8 h-8 bg-transparent"></media-play-button>
                        <media-time-display
                            showduration
                            className="text-white text-sm font-mono bg-transparent"
                        ></media-time-display>
                    </div>

                    {/* Center Seek Bar */}
                    <media-time-range className="flex-1 mx-4 h-2 rounded overflow-hidden bg-transparent"></media-time-range>

                    {/* Right Controls */}
                    <div className="flex items-center gap-2">
                        <media-mute-button className="bg-transparent"></media-mute-button>
                        <media-volume-range className="w-24 h-2 bg-transparent"></media-volume-range>
                        <media-pip-button className="w-6 h-6 bg-transparent"></media-pip-button>
                        <media-fullscreen-button className="w-6 h-6 bg-transparent"></media-fullscreen-button>
                    </div>
                </media-control-bar>
            </media-controller>
        </div>
    );
}
