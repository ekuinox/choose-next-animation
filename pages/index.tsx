import path from "path";
import Head from "next/head";
import Link from "next/link";
import { readFileSync } from "fs";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { loginCallbackQueryType } from "../lib/annict";
import { AnimationWithNullableToken } from "../components/animation";

const useTokenAndUsername = () => {
  const { query } = useRouter();
  const [state, setState] = useState<[string | null, string | null]>([null, null]);
  useEffect(() => {
    const data = loginCallbackQueryType.safeParse(query);
    if (!data.success) {
      setState([sessionStorage.getItem('accessToken'), sessionStorage.getItem('username')]);
      return;
    }
    sessionStorage.setItem('accessToken', data.data.accessToken);
    sessionStorage.setItem('username', data.data.username);
    setState([data.data.accessToken, data.data.username]);
  }, [query]);
  return state;
};

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
  const [token, _] = useTokenAndUsername();
  const router = useRouter();
  useEffect(() => {
    if (token == null) {
      return;
    }
    router.push('/');
  }, [token]);
  return (
    <>
      <Head>
        <title>choose-next-animation</title>
      </Head>
      <main>
        <div style={{
          textAlign: 'center'
        }}>
          <AnimationWithNullableToken token={token} />
          <div style={{ marginTop: '1vh' }}>
            <Link href={repository}>Repository</Link> / <Link href={author.url}>{`${author.name} <${author.email}>`}</Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
