import { Box, Text, Link, Flex } from "@chakra-ui/react";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function Watermark() {
  return (
    <Box position="fixed" bottom={4} right={4} zIndex={999}>
      <Link
        href="https://ibnu.mardini.dev"
        isExternal
        _hover={{ transform: "scale(1.02)" }}
        transition="transform 0.2s"
      >
        <Box
          bg="black"
          color="white"
          px={3}
          py={1}
          rounded="md"
          fontSize="xs"
          fontWeight="medium"
          opacity={0.7}
          _hover={{
            opacity: 1,
          }}
          transition="opacity 0.2s"
        >
          <Flex align="center" gap={1}>
            <Text>https://ibnu.mardini.dev</Text>
            <FaExternalLinkAlt size={8} />
          </Flex>
        </Box>
      </Link>
    </Box>
  );
}
