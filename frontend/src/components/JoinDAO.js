import Navbar from "./Navbar";
import Fund from "./Fund";
import { useEffect, useState } from 'react'
import { Heading, Container, Text, Stack, Button, Input, InputGroup, InputLeftAddon, HStack, Avatar } from '@chakra-ui/react'
import { Auth } from '@polybase/auth'
import { ethPersonalSignRecoverPublicKey } from '@polybase/eth'
import { Polybase } from '@polybase/client'
import { useCollection } from '@polybase/react'

const db = new Polybase({
  defaultNamespace: 'pk/0x476e90ba4facb03930c0a97fc4c3271e845d3a3f59cfb827f516e10eedeb847a6ad77807b40c59833aadafecf47535274f564f48fa4e3c1086b556270d3444c6/Showcase',
})

const auth = new Auth()

async function getPublicKey() {
  const msg = 'Login with Chat'
  const sig = await auth.ethPersonalSign(msg)
  const publicKey = ethPersonalSignRecoverPublicKey(sig, msg)
  return '0x' + publicKey.slice(4)
}

export default function JoinDAO() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [publicKey, setPublicKey] = useState()
  const [nftId, setNftId] = useState('')
  const [projectId, setProjectId] = useState()


  const query = db.collection('NFT')
  const { data, error, loading } = useCollection(query)

  var nfts = data === null || data === void 0 ? void 0 : data.data;

  const signIn = async () => {
    const res = await auth.signIn()

    // get public
    let publicKey = res.publicKey

    if (!publicKey) {
      publicKey = await getPublicKey()
    }

    db.signer(async (data) => {
      return {
        h: 'eth-personal-sign',
        sig: await auth.ethPersonalSign(data),
      }
    })

    // Create user if not exists
    try {
      const user = await db.collection('User').record(publicKey).get()
      console.log('User', user)
    } catch (e) {
      await db.collection('User').create([])
    }

    setIsLoggedIn(!!res)
  }

  useEffect(() => {
    auth.onAuthUpdate((authState) => {
      setIsLoggedIn(!!authState)

      db.signer(async (data) => {
        return {
          h: 'eth-personal-sign',
          sig: await auth.ethPersonalSign(data),
        }
      })
    })
  })

  const createNFT = async () => {
    const publicKey = await getPublicKey()
    await db.collection('NFT').create([nftId, db.collection('User').record(publicKey)])
  }

  const createProject = async () => {
    const publicKey = await getPublicKey()
    await db.collection('Projects').create([nftId, db.collection('User').record(publicKey)])
  }

  return (
    <Container p={10}>
      <Navbar></Navbar>
      {/* <Stack spacing={8} maxW='30em'>
        <Stack>
          <Heading as='h1'>Chats</Heading>
          <Text>Welcome to the amazing app that chats.</Text>
        </Stack>
        <Stack>
          {isLoggedIn ? (
            <Stack >
              < Heading as='h2' fontSize='2xl'>NFTS</Heading>
              {nfts?.map(() => {
                return (
                  <Stack maxW='30em'>
                    <HStack border='1px solid' borderColor='gray.100' borderRadius='md' p={4}>
                      <Avatar size='sm' name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
                      <Heading fontSize='lg'>@id</Heading>
                    </HStack>
                  </Stack>
                )
              })}
              <Stack>
                <Heading as='h2' fontSize='md'>Mint NFT</Heading>
                <InputGroup>
                  <InputLeftAddon children='@' />
                  <Input onChange={(e) => setNftId(e.target.value)} />
                </InputGroup>
                <Button onClick={createNFT}>Create</Button>
              </Stack>
              <Stack>
                <Heading as='h2' fontSize='md'>Create Project</Heading>
                <InputGroup>
                  <InputLeftAddon children='@' />
                  <Input onChange={(e) => projectId(e.target.value)} />
                </InputGroup>
                <Button onClick={createProject}>Create</Button>
              </Stack>
            </Stack>
            
          ) : (
            <Button onClick={signIn}>Login with Wallet</Button>
          )}
        </Stack>
        {isLoggedIn && (
          <Stack>
            <Heading as='h2' fontSize='2xl'>Logout</Heading>
            <Button>Logout</Button>
          </Stack>
        )}
      </Stack > */}
      <Fund></Fund>
    </Container>
  )
}

