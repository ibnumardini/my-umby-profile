import { useState } from "react";
import {
  Box,
  Card,
  CardBody,
  Heading,
  Divider,
  Center,
  Button,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import Student from "./Student";

function App() {
  const [nim, setNim] = useState("");
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const apiBaseUrl = "https://my-umby-profile-api.vercel.app";
  const toast = useToast();

  function handleSearch() {
    if (!nim) {
      setStudent(null);
      return false;
    }

    setIsLoading(true);

    fetch(`${apiBaseUrl}/student/${nim}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setStudent(data.result);

        toast({
          title: "Successfully.",
          description: "Successfully retrieve student data for you.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      })
      .catch((err) => {
        console.log(err);

        toast({
          title: "Failed.",
          description: "Failed to retrieve student data for you.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      w="100vw"
      h="100vh"
      flexDir="column"
    >
      <Card w={["sm", "lg"]}>
        <CardBody>
          <Center>
            <Heading size="md" my={2}>
              My UMBY Profile
            </Heading>
          </Center>
          <Divider mt={2} mb={2} />
          <Box display="flex" gap={2}>
            <Input
              placeholder="Type Your NIM"
              value={nim}
              onChange={({ target }) => setNim(target.value)}
            />
            <Button variant="solid" colorScheme="blue" onClick={handleSearch}>
              Search
            </Button>
          </Box>
          {isLoading ? (
            <Center>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
                mt={3}
              />
            </Center>
          ) : (
            student && <Student student={student} />
          )}
        </CardBody>
      </Card>
    </Box>
  );
}

export default App;
