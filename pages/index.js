import Head from 'next/head'
import Image from 'next/image'
import {useState, useEffect} from 'react'
import { usePassengerContext } from "../context/passenger-context";
import React from 'react'
import ReactPlayer from 'react-player'
import Link from 'next/link'

const hicdex ='https://api.hicdex.com/v1/graphql'


export const getStaticProps = async() => {

  const queryObjkts = `
    query ObjktsByTag($tag: String!) {
     hic_et_nunc_token(where: {mime: {_nilike: "%audio%"}, supply: {_neq: "0"}, token_tags: {tag: {tag: {_regex: $tag}}}}, order_by: {id: desc})  {
      id
      mime
      artifact_uri
      creator {
        address
        name
      }
    }
  }`;

   async function fetchGraphQL(queryObjkts, name, variables) {
    let result = await fetch(hicdex, {
      method: 'POST',
      body: JSON.stringify({
        query: queryObjkts,
        variables: variables,
        operationName: name,
      }),
    })
    return await result.json()
  }


    const { errors, data } = await fetchGraphQL(queryObjkts, 'ObjktsByTag', { tag: 'glitch' })
    if (errors) {
      console.error(errors)
    }

    const axios = require('axios');
    const banned = await axios.get('https://raw.githubusercontent.com/hicetnunc2000/hicetnunc-reports/main/filters/w.json');
    const gletchs = data.hic_et_nunc_token.filter((i) => !banned.data.includes(i.creator.address))

    return {
      props: { gletchs },
      revalidate: 120
  };
};


export default function Home({ gletchs }) {
  const [shuffled,setShuffled] = useState();
  const rand = Math.floor(Math.random() * 188)
  const randSlice = Math.floor(Math.random() * gletchs.length-rand)
  const slicedGletchs = gletchs.slice(randSlice, randSlice+rand)
 
  useEffect(() => {
     const shuffleGletches = (a) => {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
     }
     setShuffled(shuffleGletches(slicedGletchs.concat(gletchs.slice(0,188-rand)))
     )
  }, [gletchs])
   
  // console.log(shuffled)
  return (
    <>
    <Head>
        <title>g̴l̸e̵t̷c̴h̶a̵r̷d̷.̷x̴y̸z̴</title>
        <meta name="description" content="gletchard.xyz" />
        <link rel="icon" href="/tezosmiami.ico" />
        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:site" content="@gletchard.xyz"/>
        <meta name="twitter:creator" content="@tezosmiami"/>
        <meta name="twitter:title" content="gletchard.xyz"/>
        <meta name="twitter:image" content="/tezos512.png" />
      </Head>
      <p></p>
    <div className='container'>
    {shuffled?.map(g=> (
      <Link key={g.id} href={`/gletch/${g.id}`} passHref>
        <div className='pop'>

       {g.mime.includes('image') ?      
      <Image
        alt=""
        // placeholder='blur'
        // quality={30}
        height={180}
        width={180}
        objectFit='cover'
        key={g.id}
        src={'https://cloudflare-ipfs.com/ipfs/' + g.artifact_uri.slice(7)}
        // blurDataURL={'https://cloudflare-ipfs.com/ipfs/' + f.artifact_uri.slice(7)}
        >
       </Image>
      : g.mime.includes('video') ?
      <div className='video'>
        <ReactPlayer url={'https://ipfs.io/ipfs/' + g.artifact_uri.slice(7)} width='100%' height='100%' muted={true} playing={true} loop={true}/>
      </div>
      : null
      }  
      </div>
      </Link>
     ))}
   </div>
   <p></p>  
  </>
  )
}

