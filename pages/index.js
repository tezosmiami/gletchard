import Head from 'next/head'
import Image from 'next/image'
import {useState, useEffect} from 'react'
import { usePassengerContext } from "../context/passenger-context";
import React from 'react'
import ReactPlayer from 'react-player'
import Link from 'next/link'

const hicdex ='https://hicdex.magiccity.live/v1/graphql'

export const getServerSideProps = async() => {

  const queryObjkts = `
    query ObjktsByTag($tag: String!, $offset: Int!) {
     token(where: {mime: {_nilike: "%audio%"}, supply: {_neq: "0"}, token_tags: {tag: {tag: {_ilike: $tag}}}}, order_by: {id: desc}, offset: $offset, limit: 44)  {
      id
      mime
      display_uri
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

    const shuffleGletches = (a) => {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }


    async function getObjkts(offset) {
      const { errors, data } = await fetchGraphQL(queryObjkts, 'ObjktsByTag', { tag: '%glitch%', offset: offset })
      if (errors) {
        console.error(errors)
       }
       return data.token
    }

    const axios = require('axios');
    const banned = await axios.get('https://raw.githubusercontent.com/teia-community/teia-report/main/restricted.json');
    const latestGletchs = await getObjkts(0)
    const random = Math.floor(Math.random() * 38000)
    const randomGletchs = await getObjkts(random)

    const filtered = randomGletchs.concat(latestGletchs).filter((i) => !banned.data.includes(i.creator.address));
    // const rand = Math.floor(Math.random() * 188);
    // const randSlice = Math.floor(Math.random() * filtered.length-rand);
    // const slicedGletchs = filtered.slice(randSlice, randSlice+rand);
    const gletchs = shuffleGletches(filtered);
   
    return {
      props: { gletchs }
      // revalidate: 120
  };
};


export default function Home({ gletchs }) {
  // const [shuffled,setShuffled] = useState();
  // const rand = Math.floor(Math.random() * 188)
  // const randSlice = Math.floor(Math.random() * gletchs.length-rand)
  // const slicedGletchs = gletchs.slice(randSlice, randSlice+rand)
 
  // useEffect(() => {
  //    const shuffleGletches = (a) => {
  //     for (let i = a.length - 1; i > 0; i--) {
  //       const j = Math.floor(Math.random() * (i + 1));
  //       [a[i], a[j]] = [a[j], a[i]];
  //     }
  //     return a;
  //    }
  //    setShuffled(shuffleGletches(slicedGletchs.concat(gletchs.slice(0,188-rand)))
  //    )
  // }, [gletchs])
   
  // console.log(shuffled)
  return (
    <>
    <Head>
        <title>g̴l̸e̵t̷c̴h̶a̵r̷d̷.̷x̴y̸z̴</title>
        <meta name="description" content="tezos - hicetnunc glitchart objkts. ." />
        <meta property="og:title" content="gletchard" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gletchard.xyz" />
        <meta property="og:image" content="/logo11.jpeg" />
        <meta property="og:description" content="tezos - hicetnunc foto objkts" />
        <link rel="icon" href="/logo11.jpeg" />
        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:site" content="@gletchard.xyz"/>
        <meta name="twitter:creator" content="@tezosmiami"/>
        <meta name="twitter:title" content="gletchard.xyz"/>
        <meta name="twitter:description" content="tezos - hicetnunc glitchart objkts" />
        <meta name="twitter:image" content="https://gateway.pinata.cloud/ipfs/QmTEKpoTXPBKvnK8UyAdT79LZufgpYXJoBB4PFpCohdM4A"/>
      </Head>
      <p></p>
    <div className='container'>
    {gletchs.map(g=> (
      <Link key={g.id} href={`/gletch/${g.id}`} passHref>
        <div className='pop'>

       {g.mime.includes('image') ?      
      <Image
        alt=""
        unoptimized
        // placeholder='blur'
        // quality={30}
        height={180}
        width={180}
        objectFit='cover'
        key={g.id}
        src={'https://ipfs.io/ipfs/' + g.display_uri.slice(7)}
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

