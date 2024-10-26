import { useNavigate } from 'react-router-dom';

function Header({ tables }) {
  const navigate = useNavigate();

  const handleTableSelect = (tableName) => {
    navigate(`/admin/${tableName}`);
  };

  const goToAnalytics = () => {
    navigate('/analytics'); // Переход на страницу аналитики
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-around', backgroundColor: '#f5f5f5', padding: '1em' }}>
      {tables.map((table) => (
        <button key={table} onClick={() => handleTableSelect(table)}>
          {table}
        </button>
      ))}
      <button onClick={goToAnalytics}>Перейти к аналитике</button>
    </header>
  );
}

export default Header;
