/* eslint-disable react/prop-types */
import {
  Stack,
  Divider,
  Center,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Avatar,
  Text,
} from "@chakra-ui/react";

export default function Student({ student }) {
  const { pict_url, ...rest } = student;

  return (
    <>
      <Divider my={2} />
      <Center>
        <Avatar src={pict_url} alt={rest.name} size="2xl" />
      </Center>
      <Stack mt="6" spacing="3">
        <TableContainer>
          <Table variant="simple">
            <Tbody>
              {Object.keys(rest).map((s) => {
                return (
                  <Tr key={s}>
                    <Td w="20%">
                      <Text
                        css={{ fontWeight: "bold" }}
                        _firstLetter={{ textTransform: "uppercase" }}
                      >
                        {s}:
                      </Text>
                    </Td>
                    <Td maxW="1px" whiteSpace="pre-line">
                      <Text align="right">{rest[s]}</Text>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </>
  );
}
