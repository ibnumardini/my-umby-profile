import PropTypes from "prop-types";
import {
  Divider,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Avatar,
  Text,
  Flex,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Student({ student }) {
  const tableBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("white", "gray.600");
  const avatarBg = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const labelColor = useColorModeValue("gray.600", "gray.400");

  if (!student) {
    return <Text>Data mahasiswa tidak tersedia</Text>;
  }

  const {
    pict_url,
    nim,
    name,
    university,
    major,
    regist_type,
    regist_date,
    gender,
    level,
    status,
  } = student;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const studentData = [
    { label: "NIM", value: nim || "N/A" },
    { label: "Nama Lengkap", value: name || "N/A" },
    { label: "Universitas", value: university || "N/A" },
    { label: "Program Studi", value: major || "N/A" },
    { label: "Jenis Pendaftaran", value: regist_type || "N/A" },
    { label: "Tanggal Registrasi", value: formatDate(regist_date) },
    { label: "Jenis Kelamin", value: gender || "N/A" },
    { label: "Jenjang Pendidikan", value: level || "N/A" },
    { label: "Status Mahasiswa", value: status || "N/A" },
  ];

  return (
    <>
      <Divider mb={4} />
      <Flex gap={8} align="flex-start">
        <Box flex="0 0 auto">
          <Box
            p={1}
            bg="linear-gradient(135deg, #1e3a8a 0%, #0f182a 100%)"
            borderRadius="20px"
            shadow="sm"
            _hover={{
              shadow: "md",
              transform: "translateY(-1px)",
              transition: "all 0.2s ease",
            }}
            transition="all 0.2s ease"
          >
            <Avatar
              src={pict_url}
              alt={name}
              w="150px"
              h="150px"
              borderRadius="16px"
              bg={avatarBg}
              border={`2px solid ${borderColor}`}
            />
          </Box>
        </Box>
        <Box flex="1">
          <TableContainer bg={tableBg} rounded="lg">
            <Table variant="simple" size="md">
              <Tbody>
                {studentData.map((item, index) => (
                  <Tr key={index}>
                    <Td w="35%" px={0} py={2}>
                      <Text
                        fontSize="md"
                        fontWeight="semibold"
                        color={labelColor}
                      >
                        {item.label}:
                      </Text>
                    </Td>
                    <Td px={3} py={2}>
                      <Text
                        fontSize="md"
                        color={textColor}
                        whiteSpace="pre-line"
                      >
                        {item.value}
                      </Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Flex>
    </>
  );
}

Student.propTypes = {
  student: PropTypes.shape({
    pict_url: PropTypes.string,
    nim: PropTypes.string,
    name: PropTypes.string,
    university: PropTypes.string,
    major: PropTypes.string,
    regist_type: PropTypes.string,
    regist_date: PropTypes.string,
    gender: PropTypes.string,
    level: PropTypes.string,
    status: PropTypes.string,
  }),
};
