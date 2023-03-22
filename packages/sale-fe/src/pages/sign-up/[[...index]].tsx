import { Container } from "@chakra-ui/react";
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => (
    <Container
        maxW="container.xl"
        display="flex"
        justifyContent="center"
        pt={24}
    >
        <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </Container>
);

export default SignUpPage;
