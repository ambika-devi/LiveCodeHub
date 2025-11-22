import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';
import dynamic from 'next/dynamic';
import axios from 'axios';

// Monaco is heavy so load it dynamically without SSR
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function RoomPage() {
    const router = useRouter();
  const roomId = router.query.id; // Next gives this via getServerSideProps or router
  const [doc, setDoc] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;
    // Fetch room initial content via REST
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}`)
      .then(res => {
        if (res.data.ok) 
            console.log('room data', res.data.room);
            setDoc(res.data.room.doc || '');
      })
      .catch(console.error);

    // Connect to socket server
    const socket = io(process.env.NEXT_PUBLIC_API_URL, { transports: ['websocket']});
    socketRef.current = socket;

    // When socket connects, join the room
    socket.on('connect', () => {
      socket.emit('join-room', { roomId, userId: socket.id });
    });

    // Get initial room data (server might send doc & language)
    socket.on('room-data', ({ doc: serverDoc }) => {
      if (serverDoc !== undefined) setDoc(serverDoc);
    });

    // When other peers broadcast editor updates, replace the editor content
    socket.on('editor-update', ({ doc: newDoc }) => {
      setDoc(newDoc);
    });

    // When run results arrive
    socket.on('run-output', ({ output, error }) => {
      console.log('runner output', output, error);
      // show to UI - not shown here for brevity
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  // Called when local editor content changes
  const onEditorChange = (value) => {
    setDoc(value);
    // Send change to server - here we send full document (simple approach)
    socketRef.current?.emit('editor-change', { roomId, doc: value });
  };

  const runCode = () => {
    socketRef.current?.emit('run-code', { roomId, code: doc, language: 'javascript' });
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <MonacoEditor
          height="100%"
          defaultLanguage="javascript"
          value={doc}
          onChange={onEditorChange}
        />
      </div>
      <div style={{ padding: 8 }}>
        <button onClick={runCode}>Run</button>
      </div>
    </div>
  );
}
