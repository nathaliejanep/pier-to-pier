import { createContext, useRef, useEffect, useState } from 'react';
import { sql } from './server/database';
import ContractService from './contracts/ContractService';

const MDS = (window as any).MDS;
export const appContext = createContext({ publicKeys: {} as any });

interface IProps {
  children: any;
}
const AppProvider = ({ children }: IProps) => {
  const [publicKeys, setPublicKeys] = useState<PublicKeys>({ buyer: '', seller: '', deleted: '' });
  const loaded = useRef(false);
  const contractService = new ContractService();

  const createTables = async () => {
    await sql.createBOLTable();
    await sql.createEventLogTable();
    // await sql.dropTable('event_logs');
    // await sql.dropTable('bills_of_lading');
  };

  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      MDS.init((msg: any) => {
        if (msg.event === 'inited') {
          console.log('inited');
          createTables();
        }
      });
    }
  }, [loaded]);

  useEffect(() => {
    (async () => {
      try {
        const keys: PublicKeys = await contractService.getPublicKeys();
        setPublicKeys(keys);
      } catch (error) {
        console.error(`getPublicKeys - ${error}`);
      }
    })();
  }, []);

  return (
    <appContext.Provider
      value={{
        publicKeys,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export default AppProvider;
