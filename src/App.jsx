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

  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
      position: "top",
    });
  };

  const fetchStudentData = async (nim) => {
    try {
      const response = await fetch(`${apiBaseUrl}/student/${nim}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error("Failed to fetch student data:", error);
      throw error;
    }
  };

  const handleSearch = async () => {
    if (!nim) {
      setStudent(null);
      return;
    }

    setIsLoading(true);

    try {
      const studentData = await fetchStudentData(nim);
      setStudent(studentData);
      showToast("Success", "Successfully retrieved student data.", "success");
    } catch {
      showToast("Error", "Failed to retrieve student data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

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
            <Button
              variant="solid"
              colorScheme="blue"
              onClick={handleSearch}
              isDisabled={isLoading}
            >
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
