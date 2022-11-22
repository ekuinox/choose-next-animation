import path from "path";
import Head from "next/head";
import Link from "next/link";
import { readFileSync } from "fs";
import { GetStaticProps } from "next";

interface HomeProps {
  repository: string;
  author: {
    name: string;
    email: string;
    url: string;
  },
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const json = readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8');
  const { author, repository: { url } } = JSON.parse(json);
  return {
    props: { repository: url, author },
  };
};

export const Home: React.FC<HomeProps> = ({ repository, author }) => {
  return (
    <>
      <Head>
        <title>choose-next-animation</title>
      </Head>
      <main>
        <div style={{
          textAlign: 'center'
        }}>
          <Link href='/api/login'>ログイン</Link>してアニメを選ぶ
          <div style={{ marginTop: '1vh' }}>
            <Link href={repository}>Repository</Link> / <Link href={author.url}>{`${author.name} <${author.email}>`}</Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
