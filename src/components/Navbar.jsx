import PropTypes from "prop-types";
import {
  Box,
  Flex,
  Text,
  IconButton,
  useColorModeValue,
  useColorMode,
  Link,
  Button,
} from "@chakra-ui/react";
import { FaGithub, FaSearch, FaUniversity, FaMoon, FaSun } from "react-icons/fa";
import { Icon } from "@chakra-ui/react"

export default function Navbar({ hasResults, onSearchAgain }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const buttonTextColor = useColorModeValue("inherit", "white");

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
          <Icon as={FaUniversity} boxSize={{ base: 5, sm: 6 }} color={useColorModeValue("primary.500", "blue.300")} />
          <Text
            fontSize={{ base: "md", sm: "xl" }}
            fontWeight="bold"
            color={useColorModeValue("primary.500", "blue.300")}
          >
            <Box as="span" display={{ base: "inline", sm: "none" }}>
              UMBY
            </Box>
            <Box as="span" display={{ base: "none", sm: "inline" }}>
              My UMBY Profile
            </Box>
          </Text>
        </Flex>

        <Flex gap={{ base: 1, sm: 2 }} align="center">
          {hasResults && (
            <Button
              size={{ base: "sm", sm: "md" }}
              colorScheme="blue"
              variant="solid"
              onClick={onSearchAgain}
              leftIcon={<FaSearch />}
              fontSize={{ base: "sm", sm: "md" }}
              rounded="full"
              px={{ base: 3, sm: 4 }}
              _hover={{
                transform: "scale(1.05)",
              }}
              transition="all 0.2s"
            >
              Cari
            </Button>
          )}
          <IconButton
            aria-label="Toggle dark mode"
            icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
            variant="ghost"
            size={{ base: "sm", sm: "md" }}
            fontSize={{ base: "md", sm: "lg" }}
            color={useColorModeValue("gray.600", "yellow.300")}
            rounded="full"
            minW={{ base: 8, sm: 10 }}
            h={{ base: 8, sm: 10 }}
            _hover={{
              color: useColorModeValue("blue.500", "yellow.200"),
              bg: useColorModeValue("blue.50", "whiteAlpha.200"),
              transform: "scale(1.1)",
            }}
            transition="all 0.2s"
          />
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
              size={{ base: "sm", sm: "md" }}
              fontSize={{ base: "md", sm: "lg" }}
              color={useColorModeValue("gray.600", "gray.300")}
              rounded="full"
              minW={{ base: 8, sm: 10 }}
              h={{ base: 8, sm: 10 }}
              _hover={{
                color: useColorModeValue("blue.500", "blue.300"),
                bg: useColorModeValue("blue.50", "whiteAlpha.200"),
                transform: "scale(1.1)",
              }}
              transition="all 0.2s"
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
