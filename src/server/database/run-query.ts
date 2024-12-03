export const runQuery = (query: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      (window as any).MDS.sql(query, function (response: any) {
        if (response.status) {
          if (response.rows) {
            console.log('SQL query resolved:', response.rows);
            return resolve(response.rows);
          }
          return resolve(response.status);
        }
        console.error('SQL query failed with response:', response);
        reject(new Error(`SQL Error: ${response?.error || 'Unknown error'}. Query: ${query}`));
      });
    } catch (err) {
      const error = err as Error;
      console.error('Unexpected error during SQL query:', err);
      reject(
        new Error(`Unexpected error during query execution: ${error.message}. Query: ${query}`),
      );
    }
  });
};
// export const runQuery = (query: string, singleResult = true): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     try {
//       (window as any).MDS.sql(query, function (response: any) {
//         if (response.status) {
//           if (response.rows && singleResult) {
//             console.log('SQL query resolved:', response.rows[0]);

//             return resolve(response.rows[0]);
//           } else if (response.rows) {
//             console.log('SQL query resolved:', response.rows);

//             return resolve(response.rows);
//           }

//           return resolve(response.status);
//         }
//         console.error('SQL query failed with response:', response);
//         reject(new Error(`SQL Error: ${response?.error || 'Unknown error'}. Query: ${query}`));
//       });
//     } catch (err) {
//       const error = err as Error;
//       console.error('Unexpected error during SQL query:', err);
//       reject(
//         new Error(`Unexpected error during query execution: ${error.message}. Query: ${query}`),
//       );
//     }
//   });
// };
