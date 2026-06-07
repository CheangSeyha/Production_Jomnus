import { create } from 'zustand';
import { getSocket } from '@/lib/websocket';

interface CallState {
  isIncomingCall: boolean;
  isOutgoingCall: boolean;
  isInCall: boolean;
  isVideo: boolean;
  conversationId: number | null;
  targetUserId: number | null;
  callerId: number | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;

  initiateCall: (conversationId: number, targetUserId: number, isVideo: boolean) => Promise<void>;
  receiveIncomingCall: (conversationId: number, callerId: number, isVideo: boolean) => void;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  endCall: (endedByRemote?: boolean) => void;
  handleSignal: (signalData: any) => Promise<void>;
}

const iceConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }], // Public Google STUN server configuration
};

export const useCallStore = create<CallState>((set, get) => ({
  isIncomingCall: false,
  isOutgoingCall: false,
  isInCall: false,
  isVideo: false,
  conversationId: null,
  targetUserId: null,
  callerId: null,
  localStream: null,
  remoteStream: null,
  peerConnection: null,

  initiateCall: async (conversationId, targetUserId, isVideo) => {
    set({ isOutgoingCall: true, isVideo, conversationId, targetUserId });

    const stream = await navigator.mediaDevices.getUserMedia({ video: isVideo, audio: true });
    set({ localStream: stream });

    // Initialize WebRTC connection early for the caller
    const pc = new RTCPeerConnection(iceConfiguration);
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.ontrack = (event) => set({ remoteStream: event.streams[0] });
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const socket = getSocket();
        socket.emit('call:signal', { conversationId, targetUserId, signalData: { candidate: event.candidate } });
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    set({ peerConnection: pc });

    // Inform the target user through the signaling server
    const socket = getSocket();
    socket.emit('call:initiate', { conversationId, targetUserId, isVideo });
    socket.emit('call:signal', { conversationId, targetUserId, signalData: { sdp: offer } });
  },

  receiveIncomingCall: (conversationId, callerId, isVideo) => {
    set({ isIncomingCall: true, conversationId, callerId, isVideo });
  },

  acceptCall: async () => {
    const { isVideo, conversationId, callerId } = get();
    set({ isIncomingCall: false, isInCall: true });

    const stream = await navigator.mediaDevices.getUserMedia({ video: isVideo, audio: true });
    set({ localStream: stream });

    const pc = new RTCPeerConnection(iceConfiguration);
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.ontrack = (event) => set({ remoteStream: event.streams[0] });
    pc.onicecandidate = (event) => {
      if (event.candidate && callerId) {
        const socket = getSocket();
        socket.emit('call:signal', { conversationId, targetUserId: callerId, signalData: { candidate: event.candidate } });
      }
    };

    set({ peerConnection: pc });
    const socket = getSocket();
    socket.emit('call:accept', { conversationId, targetUserId: callerId });
  },

  rejectCall: () => {
    const { conversationId, callerId } = get();
    if (callerId) {
      const socket = getSocket();
      socket.emit('call:end', { conversationId, targetUserId: callerId });
    }
    set({ isIncomingCall: false, conversationId: null, callerId: null });
  },

  endCall: (endedByRemote = false) => {
    const { peerConnection, localStream, conversationId, targetUserId, callerId } = get();
    
    localStream?.getTracks().forEach((track) => track.stop()); // Shuts off device cameras/mics
    peerConnection?.close();

    const activePeerId = targetUserId || callerId;
    if (!endedByRemote && activePeerId) {
      const socket = getSocket();
      socket.emit('call:end', { conversationId, targetUserId: activePeerId, duration: 0 }); 
    }

    set({
      isIncomingCall: false,
      isOutgoingCall: false,
      isInCall: false,
      localStream: null,
      remoteStream: null,
      peerConnection: null,
      conversationId: null,
      targetUserId: null,
      callerId: null,
    });
  },

  handleSignal: async (signalData) => {
    const { peerConnection, conversationId, callerId, targetUserId } = get();
    const activePeerId = targetUserId || callerId;
    if (!peerConnection || !activePeerId) return;

    if (signalData.candidate) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(signalData.candidate));
    }

    if (signalData.sdp) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(signalData.sdp));
      if (signalData.sdp.type === 'offer') {
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        const socket = getSocket();
        socket.emit('call:signal', { conversationId, targetUserId: activePeerId, signalData: { sdp: answer } });
      }
    }
  },
}));