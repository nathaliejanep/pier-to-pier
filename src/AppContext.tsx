import { createContext, useRef, useEffect } from 'react';
import { sql } from './server/database';

export const appContext = createContext({} as any);

interface IProps {
  children: any;
}
const AppProvider = ({ children }: IProps) => {
  const loaded = useRef(false);

  const createTables = async () => {
    await sql.createBOLTable();
    await sql.createEventLogTable();
  };

  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      (window as any).MDS.init((msg: any) => {
        if (msg.event === 'inited') {
          console.log('inited');
          createTables();
        }
      });
    }
  }, [loaded]);

  return (
    <appContext.Provider
      value={
        {
          // add some stuff
        }
      }
    >
      {children}
    </appContext.Provider>
  );
};

export default AppProvider;
