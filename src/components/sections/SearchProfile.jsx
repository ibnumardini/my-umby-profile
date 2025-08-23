import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  VStack,
  Textarea,
  useColorModeValue,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
  Link,
} from "@chakra-ui/react";
import { FaSearch, FaEye, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Student from "../modal/Student";

export default function SearchProfile({ onResultsChange, resetTrigger }) {
  const [nimInput, setNimInput] = useState("");
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bg = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    "https://my-umby-profile-api.vercel.app";
  const toast = useToast();

  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  };

  const fetchStudentData = async (nims) => {
    try {
      const response = await fetch(`${apiBaseUrl}/student/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nims: nims,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.result || data;
    } catch (error) {
      console.error("Failed to fetch student data:", error);
      throw error;
    }
  };

  const handleSearch = async () => {
    if (!nimInput.trim()) {
      setStudents([]);
      setErrors([]);
      return;
    }

    const nimList = nimInput
      .split(/[\n,\s]+/)
      .map((nim) => nim.trim())
      .filter((nim) => nim.length > 0);

    const invalidNims = nimList.filter((nim) => nim.length !== 9);
    if (invalidNims.length > 0) {
      showToast(
        "Error",
        `NIM harus 9 karakter. NIM tidak valid: ${invalidNims.join(", ")}`,
        "error"
      );
      return;
    }

    if (nimList.length === 0) return;

    setIsLoading(true);
    setStudents([]);
    setErrors([]);

    try {
      const batchResult = await fetchStudentData(nimList);

      const allResults = [];
      const successCount = [];
      const errorCount = [];
      const seenNims = new Set();

      const processResult = (result) => {
        if (result && result.nim && !seenNims.has(result.nim)) {
          seenNims.add(result.nim);
          allResults.push(result);
          if (result.found === true) {
            successCount.push(result);
          } else {
            errorCount.push(result);
          }
        }
      };

      if (Array.isArray(batchResult)) {
        batchResult.forEach(processResult);
      } else if (batchResult.success && Array.isArray(batchResult.data)) {
        batchResult.data.forEach(processResult);
      }

      setStudents(allResults);
      setErrors([]);

      if (successCount.length > 0) {
        showToast(
          "Success",
          `Berhasil mengambil ${successCount.length} profil mahasiswa`,
          "success"
        );
      }

      if (errorCount.length > 0) {
        showToast(
          "Info",
          `${errorCount.length} NIM tidak ditemukan di database`,
          "info"
        );
      }
    } catch (error) {
      setErrors([`Error: ${error.message}`]);
      showToast("Error", "Gagal mengambil data mahasiswa", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const hasResults = students.length > 0 || errors.length > 0;

  const sortStudents = (studentsToSort) => {
    if (!sortOrder) return studentsToSort;

    return [...studentsToSort].sort((a, b) => {
      if (sortOrder === "asc") {
        if (a.found !== b.found) {
          return b.found ? 1 : -1;
        }
        return a.nim.localeCompare(b.nim);
      } else {
        if (a.found !== b.found) {
          return a.found ? 1 : -1;
        }
        return b.nim.localeCompare(a.nim);
      }
    });
  };

  const handleSort = () => {
    if (sortOrder === null) {
      setSortOrder("asc");
    } else if (sortOrder === "asc") {
      setSortOrder("desc");
    } else {
      setSortOrder(null);
    }
  };

  const sortedStudents = sortStudents(students);

  useEffect(() => {
    onResultsChange?.(hasResults);
  }, [hasResults, onResultsChange]);

  useEffect(() => {
    if (resetTrigger > 0) {
      setStudents([]);
      setErrors([]);
      setNimInput("");
      setSortOrder(null);
    }
  }, [resetTrigger]);

  useEffect(() => {
    showToast(
      "Selamat Datang! 👋",
      "Selamat datang di UMBY Student Directory. Masukkan NIM untuk mencari data mahasiswa.",
      "success"
    );
  }, []);

  return (
    <>
      {!hasResults && (
        <Box
          id="home"
          bg={bg}
          h="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Container maxW="container.xl">
            <VStack spacing={12} textAlign="center">
              <Stack spacing={4} align="center">
                <Heading
                  as="h1"
                  fontSize={{ base: "3xl", md: "5xl" }}
                  fontWeight="bold"
                  color="blue.500"
                  maxW="800px"
                  lineHeight="shorter"
                >
                  UMBY Student Directory
                </Heading>
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  color={textColor}
                  maxW="600px"
                  lineHeight="tall"
                >
                  Sistem Informasi Profil Mahasiswa Universitas Mercu Buana
                  Yogyakarta. Data diambil langsung dari{" "}
                  <Link
                    href="https://pddikti.kemdiktisaintek.go.id/"
                    isExternal
                    color="blue.500"
                    textDecoration="underline"
                    _hover={{ color: "blue.600" }}
                  >
                    PDDIKTI (Pangkalan Data Pendidikan Tinggi)
                  </Link>
                  . Silakan masukkan NIM (pisahkan dengan spasi atau koma) untuk
                  menampilkan detail profil mahasiswa secara lengkap dan akurat.
                </Text>
              </Stack>

              <Stack spacing={4} w="100%" maxW="600px">
                <Textarea
                  placeholder="Masukkan NIM (pisahkan dengan spasi atau koma)&#10;Contoh:&#10;231110040, 2311100xx&#10;atau&#10;231110040 2311100xx"
                  value={nimInput}
                  onChange={(e) => setNimInput(e.target.value)}
                  size="lg"
                  minH="200px"
                  fontSize="md"
                  resize="vertical"
                />

                <Button
                  colorScheme="blue"
                  size="lg"
                  fontSize="lg"
                  fontWeight="semibold"
                  onClick={handleSearch}
                  isDisabled={isLoading || !nimInput.trim()}
                  _hover={{
                    transform: "translateY(-1px)",
                    boxShadow: "lg",
                  }}
                  transition="all 0.2s"
                  leftIcon={isLoading ? <Spinner size="sm" /> : <FaSearch />}
                >
                  {isLoading ? "Mencari..." : "Cari Profil"}
                </Button>

                <Button
                  colorScheme="gray"
                  variant="ghost"
                  size="sm"
                  fontSize="sm"
                  onClick={() => {
                    const count = Math.floor(Math.random() * 4) + 3;
                    const randomNims = [];

                    for (let i = 0; i < count; i++) {
                      const randomNum = Math.floor(Math.random() * 100)
                        .toString()
                        .padStart(2, "0");
                      randomNims.push(`2311100${randomNum}`);
                    }

                    setNimInput(randomNims.join(", "));

                    setTimeout(() => {
                      handleSearch();
                    }, 100);
                  }}
                >
                  🎲 NIM Acak
                </Button>
              </Stack>
            </VStack>
          </Container>
        </Box>
      )}

      {hasResults && (
        <Box bg={bg} minH="100vh" pt={32} pb={20}>
          <Container maxW="container.xl">
            <VStack spacing={12}>
              {errors.length > 0 && (
                <Alert status="warning" maxW="600px" rounded="md">
                  <AlertIcon />
                  <Box>
                    <Text fontWeight="bold">NIM yang tidak ditemukan:</Text>
                    {errors.map((error, index) => (
                      <Text key={index} fontSize="sm">
                        {error}
                      </Text>
                    ))}
                  </Box>
                </Alert>
              )}

              {students.length > 0 && (
                <Box w="100%" maxW="1200px">
                  <VStack spacing={6}>
                    <Box textAlign="center" mb={4}>
                      <Heading
                        size="xl"
                        color="primary.600"
                        mb={2}
                        fontWeight="bold"
                      >
                        Hasil Pencarian
                      </Heading>
                      <Text color="gray.600" fontSize="md">
                        Ditemukan {students.filter((s) => s.found).length} dari{" "}
                        {students.length} mahasiswa
                      </Text>
                    </Box>
                    <TableContainer
                      bg="white"
                      rounded="xl"
                      shadow="lg"
                      w="100%"
                    >
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>No.</Th>
                            <Th
                              cursor="pointer"
                              onClick={handleSort}
                              _hover={{ bg: "gray.50" }}
                              userSelect="none"
                            >
                              <Flex align="center" gap={1}>
                                NIM
                                {sortOrder === null && (
                                  <FaSort opacity={0.5} size={10} />
                                )}
                                {sortOrder === "asc" && (
                                  <FaSortUp color="#1e3a8a" size={10} />
                                )}
                                {sortOrder === "desc" && (
                                  <FaSortDown color="#1e3a8a" size={10} />
                                )}
                              </Flex>
                            </Th>
                            <Th>Nama</Th>
                            <Th>Aksi</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {sortedStudents.map((student, index) => {
                            const isFound = student.found === true;
                            return (
                              <Tr key={index}>
                                <Td fontWeight="semibold">{index + 1}</Td>
                                <Td>
                                  <Flex align="center" gap={2}>
                                    <Box
                                      w={3}
                                      h={3}
                                      borderRadius="full"
                                      bg={isFound ? "green.500" : "red.500"}
                                    />
                                    <Text fontWeight="semibold">
                                      {student.nim || "N/A"}
                                    </Text>
                                  </Flex>
                                </Td>
                                <Td>{isFound ? student.name || "N/A" : "-"}</Td>
                                <Td>
                                  {isFound ? (
                                    <Button
                                      size="sm"
                                      colorScheme="blue"
                                      onClick={() => {
                                        console.log(
                                          "Selected student:",
                                          student
                                        );
                                        setSelectedStudent(student);
                                        onOpen();
                                      }}
                                      leftIcon={<FaEye size={10} />}
                                    >
                                      Lihat Detail
                                    </Button>
                                  ) : (
                                    <Text fontSize="sm" color="gray.500">
                                      -
                                    </Text>
                                  )}
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </VStack>
                </Box>
              )}
            </VStack>
          </Container>
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={0} display="flex" alignItems="center">
            Detail Mahasiswa
          </ModalHeader>
          <ModalCloseButton top={4} />
          <ModalBody pb={6} pt={4}>
            {selectedStudent ? (
              <Student student={selectedStudent} />
            ) : (
              <Text>Memuat...</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

SearchProfile.propTypes = {
  onResultsChange: PropTypes.func,
  resetTrigger: PropTypes.number,
};
