export default function StatusBar({ language, cursor }) {
  return (
    <footer className="status-bar">
      <span>main</span>
      <span>UTF-8</span>
      <span>{language}</span>
      <span>{`Ln ${cursor.line}, Col ${cursor.column}`}</span>
    </footer>
  );
}
