import PropTypes from "prop-types";
import {
  Box,
  Flex,
  Text,
  IconButton,
  useColorModeValue,
  Link,
  Button,
} from "@chakra-ui/react";
import { FaGithub, FaArrowLeft, FaUniversity } from "react-icons/fa";
import { Icon } from "@chakra-ui/react"

export default function Navbar({ hasResults, onSearchAgain }) {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      position="fixed"
      top={{ base: 3, sm: 6 }}
      left={{ base: 3, sm: 6 }}
      right={{ base: 3, sm: 6 }}
      zIndex={1000}
    >
      <Flex
        bg={bg}
        border="1px"
        borderColor={borderColor}
        rounded="2xl"
        shadow="sm"
        backdropFilter="blur(10px)"
        backgroundColor={useColorModeValue(
          "rgba(255, 255, 255, 0.95)",
          "rgba(26, 32, 44, 0.95)"
        )}
        px={{ base: 4, sm: 8 }}
        py={{ base: 2, sm: 3 }}
        alignItems="center"
        justifyContent="space-between"
        maxW="1200px"
        mx="auto"
      >
        <Flex
          align="center"
          gap={{ base: 1, sm: 2 }}
          cursor="pointer"
          onClick={onSearchAgain}
          _hover={{ opacity: 0.8 }}
          transition="opacity 0.2s"
        >
          <Icon as={FaUniversity} boxSize={{ base: 5, sm: 6 }} color="primary.500" />
          <Text
            fontSize={{ base: "md", sm: "xl" }}
            fontWeight="bold"
            color="primary.500"
          >
            My UMBY Profile
          </Text>
        </Flex>

        <Flex gap={3} align="center">
          {hasResults && (
            <Button
              size="sm"
              colorScheme="blue"
              variant="outline"
              onClick={onSearchAgain}
              fontSize="sm"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Flex align="center" gap={2} w="100%">
                <FaArrowLeft size={10} />
                <Text>Cari Kembali</Text>
                <Box
                  w={2}
                  h={2}
                  bg="yellow.400"
                  borderRadius="full"
                  animation="pulse 1.5s infinite"
                  sx={{
                    "@keyframes pulse": {
                      "0%, 100%": { opacity: 1, transform: "scale(1)" },
                      "50%": { opacity: 0.3, transform: "scale(1.8)" },
                    },
                  }}
                />
              </Flex>
            </Button>
          )}
          <Link
            href="https://github.com/ibnumardini/my-umby-profile"
            isExternal
            _hover={{ transform: "scale(1.1)" }}
            transition="transform 0.2s"
          >
            <IconButton
              aria-label="GitHub Repository"
              icon={<FaGithub />}
              variant="ghost"
              size="md"
              fontSize="lg"
              color="gray.600"
              rounded="full"
              _hover={{
                color: "blue.500",
                bg: "blue.50",
              }}
            />
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
}

Navbar.propTypes = {
  hasResults: PropTypes.bool.isRequired,
  onSearchAgain: PropTypes.func.isRequired,
};
