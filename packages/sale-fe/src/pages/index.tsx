import { Box, Button, Text } from "@chakra-ui/react";
import { type NextPage } from "next";
import DefaultLayout from "~/layouts/default";
import { FaArrowRight } from 'react-icons/fa'
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

const Home: NextPage = () => {
  const { isSignedIn } = useAuth();

  return (
    <DefaultLayout>
      <Box
        display="flex"
        justifyContent="center"
        flexDirection="column"
        mt={20}
      >
        <Box
          display="flex"
          justifyContent="center"
        >
          <Text
            fontSize="6xl"
            fontWeight="bold"
            color="cyan.200"
          >
            Selling never been easier
          </Text>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          mt={8}
        >
          <Link
            href={isSignedIn ? '/dashboard' : '/signup'}
            passHref
          >
            <Button
              colorScheme="teal"
              rightIcon={<FaArrowRight />}
              fontSize="lg"
            >
              Get Started
            </Button>
          </Link>
        </Box>
      </Box>
    </DefaultLayout>
  );
};

export default Home;
