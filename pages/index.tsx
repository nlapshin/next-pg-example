import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import db from '../lib/db';

type ConnectionStatus = {
  isConnected: boolean;
  users: any[];
  usersCount: number;
};

export const getServerSideProps: GetServerSideProps<
  ConnectionStatus
> = async () => {
  try {
    const { rows: users } = await db.query(`
      SELECT
        "user".name as username, 
        "user".email, 
        json_agg(
          json_build_object(
              'id', post.id,
              'title', post.title,
              'content', post.content
          )
      ) AS posts
      FROM "User" AS "user"
      JOIN "Post" AS post ON "user".id = post."userId"
      GROUP BY "user".id, "user".name, "user".email;
    `);
    const { rows: usersCount }  = await db.query('SELECT count(id) from "User"');

    console.log(users);
    console.log(usersCount[0].count);


    return {
      props: { 
        isConnected: true,
        users: users,
        usersCount: usersCount[0].count
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { 
        isConnected: false,
        users: [],
        usersCount: 0
      },
    };
  }
};

export default function Home({
  isConnected,
  users,
  usersCount
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="container">
      <main>
        {isConnected ? (
          <h2 className="subtitle">You are connected to PostgreSQL</h2>
        ) : (
          <h2 className="subtitle">
            You are NOT connected to PostgreSQL. Check the <code>README.md</code>{" "}
            for instructions.
          </h2>
        )}

        <div className="grid">
          <div className="card">
              <h3>Users({usersCount})</h3>
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Posts</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.posts.map(post => post.title).join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .subtitle {
          font-size: 2rem;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        .user-table {
          width: 100%;
          border-collapse: collapse;
        }
        .user-table, .user-table th, .user-table td {
          border: 1px solid #ddd;
        }
        .user-table th, .user-table td {
          padding: 8px;
          text-align: left;
        }
        .user-table th {
          background-color: #f2f2f2;
        }
        .user-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        .query-table {
          width: 100%;
          border-collapse: collapse;
        }
        .query-table, .query-table th, .query-table td {
          border: 1px solid #ddd;
        }
        .query-table th, .query-table td {
          padding: 8px;
          text-align: left;
        }
        .query-table th {
          background-color: #f2f2f2;
        }
        .query-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
