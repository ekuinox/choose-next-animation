import path from "path";
import Head from "next/head";
import { readFileSync } from "fs";
import Card from "@mui/material/Card";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { loginCallbackQueryType } from "../lib/annict";
import { AnimationWithNullableToken } from "../components/animation";
import { ResponsiveAppBar } from "../components/appbar";

const useTokenAndUsername = () => {
  const { query, push } = useRouter();
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
    push('/');
  }, [query, push]);
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
  return (
    <>
      <Head>
        <title>choose-next-animation</title>
      </Head>
      <main>
        <ResponsiveAppBar repo={repository} />
        <Card style={{
          textAlign: 'center',
          padding: '1em',
        }}>
          <AnimationWithNullableToken token={token} />
        </Card>
      </main>
    </>
  );
};

export default Home;
