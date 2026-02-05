const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  return (
    <main className="container">
      <h1>Recruiting CRM</h1>
      <p>Frontend is running via React + Vite.</p>
      <p>
        Backend API URL: <code>{apiUrl}</code>
      </p>
    </main>
  );
}

export default App;
