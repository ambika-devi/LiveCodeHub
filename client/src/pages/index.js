import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  const joinRoom = () => {
    if (!roomId.trim()) return alert("Enter a room ID");

    router.push(`/room/${roomId}`);
  };

  const createRoom = () => {
    const id = Math.random().toString(36).substring(2, 10);
    router.push(`/room/${id}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚡ Real-Time Code Editor</h1>
      <p style={styles.subtitle}>Collaborate live with anyone in a shared coding room.</p>

      <div style={styles.inputBox}>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          style={styles.input}
        />
        <button onClick={joinRoom} style={styles.joinBtn}>
          Join Room
        </button>
      </div>

      <button onClick={createRoom} style={styles.createBtn}>
        + Create New Room
      </button>
    </div>
  );
}

const styles = {
  container: {
    background: "#0d1117",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },
  title: {
    fontSize: "40px",
    marginBottom: "10px",
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: "30px",
  },
  inputBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    width: "260px",
    borderRadius: "8px",
    border: "1px solid #30363d",
    background: "#161b22",
    color: "white",
  },
  joinBtn: {
    padding: "10px 20px",
    background: "#238636",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
  },
  createBtn: {
    padding: "12px 26px",
    background: "#1f6feb",
    border: "none",
    borderRadius: "8px",
    paddingTop: "12px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
  },
};
