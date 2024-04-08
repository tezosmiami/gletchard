import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ReactPlayer from 'react-player'

const hicdex ='https://hicdex.magiccity.live/v1/graphql'

const querySubjkt = `
query query_name ($name: String!) {
  holder(where: {name: {_eq: $name}}) {
    address
  }
}
`

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

// export const getStaticPaths = async() => {
 
//   const queryGletchardists = `
//   query gletchardists ($tag: String!) {
//   hic_et_nunc_tag(where: {tag: {_regex: $tag}}) {
//     tag_tokens(where: {token: {supply: {_neq: "0"}}}) {
//       token {
//         creator {
//           address
//           name
//         }
//       }
//     }
//   }
// }`;

//    const { errors, data } = await fetchGraphQL(queryGletchardists, 'gletchardists', { tag: 'glitch' })
//     if (errors) {
//       console.error(errors)
//     }

//     const axios = require('axios');
//     const banned = await axios.get('https://raw.githubusercontent.com/hicetnunc2000/hicetnunc/main/filters/w.json');
//     const gletchardists = data.hic_et_nunc_tag[0].tag_tokens.filter(i => !banned.data.includes(i.token.creator.address));

//     const paths = gletchardists.map(f => {
//       return {
//           params: {
//           g: `${f.name || f.address}`,
//           // banned: response.data
//         }
//       }
//     })

//   return {
//       paths,
//       fallback: 'blocking'
//   };
// };


export const getServerSideProps = async({ params }) => {

  const objktsByAddress = `
query query_address($address: String!, $tag: String!) {
  token(where: {mime: {_nilike: "%audio%"}, supply: {_neq: "0"}, creator: {address: {_eq: $address}, tokens: {token_tags: {tag: {tag: {_regex: $tag}}}}}}, order_by: {id: desc}) {
    artifact_uri
    id
    mime
    creator{
      address
      name
    }
  }
}
`

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

  const getAddress = async () => {

    const { errors, data } = await fetchGraphQL(querySubjkt, 'query_name', { name: params.g })
    if (errors) {
      console.error(errors)
    }
    if (!data.holder[0]) return {notFound: true}
    return data.holder[0]?.address || {notFound: true}

  }
    
    const address = params.g.length == 36 ? params.g : await getAddress();
   
    const { errors, data } = await fetchGraphQL(objktsByAddress, 'query_address', { address: address, tag: 'glitch' })
    if (errors) {
      console.error(errors)
    }

    const axios = require('axios');
    const banned = await axios.get('https://raw.githubusercontent.com/teia-community/teia-report/main/restricted.json');
    const gletchs = data.token.filter(i => !banned.data.includes(i.address));

    if (banned.data.includes(address)) {return {notFound: true}}
    
  return {
      props: { gletchs },
  };
};


export default function Galerie({ gletchs }) {
    
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
      <p><a href={`https://tzkt.io/${gletchs[0]?.creator.address}`} target="blank"  rel="noopener noreferrer">
      {gletchs[0]?.creator.name || gletchs[0]?.creator.address.substr(0, 5) + "..." + gletchs[0]?.creator.address.substr(-5)}</a></p>
    <div className='container'>
    {gletchs.map(g => (
      <Link key={g.id} href={`/gletch/${g.id}`} token={`https://ipfs.io/ipfs/${g.artifact_uri.slice(7)}`} passHref>
        <div className='pop'>
        {g.mime.includes('image') ?      
      <Image 
        alt=""
        unoptimized
        height={180}
        width={180}
        key={g.id}
        objectFit='cover'
        src={'https://ipfs.io/ipfs/' + g.artifact_uri.slice(7)}>
       </Image>
       :
       g.mime.includes('video') ?     
       <div className='video'>
       <ReactPlayer url={'https://ipfs.io/ipfs/' + g.artifact_uri.slice(7)} width='100%' height='100%' playing={true} muted={true} loop={true} />
      </div>
      :
      null
      }
      </div>
      </Link>
     ))}
   </div>
   <p></p>  
  </>
  )
}

    
