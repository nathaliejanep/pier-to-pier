import { sql } from '../server/database';

const DEVtool = () => {
  const deleteTable = async () => {
    await sql.dropTable('event_logs');
    await sql.dropTable('bills_of_lading');
  };

  return (
    <div>
      DEVtool
      <button onClick={deleteTable}>Delete BOL</button>
    </div>
  );
};
export default DEVtool;
