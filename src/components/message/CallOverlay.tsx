"use client";

import { useEffect, useRef, useState } from "react";
import { useCallStore } from "@/store/callStore";
import { PhoneOff, Phone, Video, Mic, MicOff, VideoOff } from "lucide-react";

export default function CallOverlay() {
  const {
    isIncomingCall,
    isOutgoingCall,
    isInCall,
    isVideo,
    localStream,
    remoteStream,
    acceptCall,
    rejectCall,
    endCall,
  } = useCallStore();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);
  
  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!localStream.getAudioTracks()[0]?.enabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!localStream.getVideoTracks()[0]?.enabled);
    }
  };

  if (!isIncomingCall && !isOutgoingCall && !isInCall) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* In Call State */}
        {isInCall && (
          <div className="flex flex-col bg-slate-900 h-[600px] w-full relative">
            {isVideo ? (
              <>
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute bottom-6 right-6 h-48 w-32 rounded-2xl object-cover shadow-lg border-2 border-white/20"
                />
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-6">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/30">
                  <Phone className="h-12 w-12 animate-pulse" />
                </div>
                <h3 className="text-2xl font-medium text-white">Audio Call</h3>
                 {/* Hidden audio element for remote stream */}
                 <audio ref={remoteVideoRef} autoPlay playsInline className="hidden" />
              </div>
            )}
            
            {/* Controls */}
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-4 rounded-full bg-slate-800/80 px-6 py-4 backdrop-blur-md">
              <button 
                onClick={toggleMute}
                className={`flex h-12 w-12 items-center justify-center rounded-full transition hover:bg-slate-700 ${isMuted ? 'bg-rose-500/20 text-rose-500' : 'bg-slate-700 text-white'}`}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
              
              {isVideo && (
                <button 
                  onClick={toggleVideo}
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition hover:bg-slate-700 ${isVideoOff ? 'bg-rose-500/20 text-rose-500' : 'bg-slate-700 text-white'}`}
                >
                  {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </button>
              )}
              
              <button 
                onClick={() => endCall(false)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white transition hover:bg-rose-600 shadow-lg shadow-rose-500/30"
              >
                <PhoneOff className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Incoming Call State */}
        {isIncomingCall && !isInCall && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-sky-100 text-sky-600 animate-bounce">
              {isVideo ? <Video className="h-10 w-10" /> : <Phone className="h-10 w-10" />}
            </div>
            <h3 className="mb-2 text-2xl font-semibold text-slate-800">Incoming {isVideo ? 'Video' : 'Audio'} Call</h3>
            <p className="mb-10 text-slate-500">Someone is calling you...</p>
            
            <div className="flex gap-6">
              <button 
                onClick={rejectCall}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500 transition hover:bg-rose-100 hover:scale-105"
              >
                <PhoneOff className="h-6 w-6" />
              </button>
              <button 
                onClick={acceptCall}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 hover:scale-105"
              >
                {isVideo ? <Video className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
              </button>
            </div>
          </div>
        )}

        {/* Outgoing Call State */}
        {isOutgoingCall && !isInCall && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-600 relative">
               <div className="absolute inset-0 rounded-full border-4 border-slate-200 border-t-sky-500 animate-spin"></div>
               {isVideo ? <Video className="h-10 w-10" /> : <Phone className="h-10 w-10" />}
            </div>
            <h3 className="mb-2 text-2xl font-semibold text-slate-800">Calling...</h3>
            <p className="mb-10 text-slate-500">Waiting for them to answer</p>
            
            <button 
              onClick={() => endCall(false)}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 hover:scale-105"
            >
              <PhoneOff className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
