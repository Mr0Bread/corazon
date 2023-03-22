import { Container } from "@chakra-ui/react";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
    <Container
        maxW="container.xl"
        display="flex"
        justifyContent="center"
        pt={24}
    >
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </Container>
);

export default SignInPage;