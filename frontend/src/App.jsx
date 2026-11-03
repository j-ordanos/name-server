import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "";

function App() {
  const [name, setName] = useState("");
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchNames = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/names`);
      setNames(response.data);
    } catch (error) {
      setMessage("Could not load names.");
    }
  };

  useEffect(() => {
    fetchNames();
  }, []);

  const saveName = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      setLoading(true);
      setMessage("");

      await axios.post(`${API_URL}/api/names`, {
        name: name.trim(),
      });

      setName("");
      setMessage("Name saved successfully!");

      await fetchNames();
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to save name.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.container}>
      <section style={styles.card}>
        <h1>Name Saver</h1>
        <p>Submit your name and keep it saved in the database.</p>

        <form onSubmit={saveName} style={styles.form}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            required
            style={styles.input}
          />

          <button disabled={loading} style={styles.button}>
            {loading ? "Saving..." : "Save Name"}
          </button>
        </form>

        {message && <p>{message}</p>}

        <h2>Saved Names ({names.length})</h2>

        {names.length === 0 ? (
          <p>No names saved yet.</p>
        ) : (
          <ul style={styles.list}>
            {names.map((item) => (
              <li key={item.id} style={styles.listItem}>
                <span>{item.name}</span>
                <small>{new Date(item.created_at).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "white",
    padding: "32px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  form: {
    display: "flex",
    gap: "10px",
    margin: "24px 0",
  },
  input: {
    flex: 1,
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
  },
  button: {
    padding: "12px 18px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  list: {
    padding: 0,
    listStyle: "none",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
  },
};

export default App;
