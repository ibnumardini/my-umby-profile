import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  Select,
  FormControl,
  FormLabel,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import {
  FaSearch,
  FaEye,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronDown,
  FaCog,
} from "react-icons/fa";
import Student from "../modal/Student";

export default function SearchProfile({ onResultsChange, resetTrigger }) {
  const [nimInput, setNimInput] = useState("");
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [advancedOptions, setAdvancedOptions] = useState({
    selectedProdi: [],
    selectedYears: [],
    nimCount: 15,
    includeMagister: true,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAdvancedOpen,
    onOpen: onAdvancedOpen,
    onClose: onAdvancedClose,
  } = useDisclosure();

  const bg = useColorModeValue("white", "gray.800");
  const bgTransparent = useColorModeValue("gray.50/40", "gray.900/40");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const tableBg = useColorModeValue("white", "gray.800");
  const tableHoverBg = useColorModeValue("gray.50", "gray.700");
  const sortIconColor = useColorModeValue("blue.800", "blue.200");
  const linkColor = useColorModeValue("blue.500", "blue.300");
  const linkHoverColor = useColorModeValue("blue.400", "blue.200");
  const headingColor = useColorModeValue("blue.500", "blue.300");
  const modalBg = useColorModeValue("white", "gray.800");
  const modalHeaderColor = useColorModeValue("gray.800", "white");
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    "https://my-umby-profile-api.vercel.app";
  const toast = useToast();

  const showToast = useCallback(
    (title, description, status) => {
      toast({
        title,
        description,
        status,
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    },
    [toast]
  );

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

  const prodiData = [
    { code: "01", name: "AGROTEKNOLOGI" },
    { code: "02", name: "PETERNAKAN" },
    { code: "03", name: "TEKNOLOGI HASIL PERTANIAN" },
    { code: "05", name: "MANAJEMEN" },
    { code: "06", name: "AKUNTANSI" },
    { code: "07", name: "ILMU KOMUNIKASI DAN MULTI MEDIA" },
    { code: "08", name: "PSIKOLOGI" },
    { code: "11", name: "INFORMATIKA" },
    { code: "12", name: "SISTEM INFORMASI" },
    { code: "13", name: "PENDIDIKAN BAHASA INGGRIS" },
    { code: "14", name: "PENDIDIKAN MATEMATIKA" },
    { code: "15", name: "BIMBINGAN KONSELING" },
    { code: "16", name: "ILMU KEOLAHRAGAAN" },
    { code: "50", name: "MAGISTER PSIKOLOGI" },
    { code: "51", name: "MAGISTER PSIKOLOGI PROFESI" },
  ];

  const generateRandomNIM = (customOptions = null) => {
    const options = customOptions || {
      selectedProdi: [],
      selectedYears: [],
      nimCount: Math.floor(Math.random() * 6) + 10,
      includeMagister: true,
    };

    const availableProdi =
      options.selectedProdi.length > 0
        ? prodiData.filter((prodi) =>
            options.selectedProdi.includes(prodi.code)
          )
        : options.includeMagister
        ? prodiData
        : prodiData.filter((prodi) => !prodi.code.startsWith("5"));

    const availableYears =
      options.selectedYears.length > 0
        ? options.selectedYears
        : [19, 20, 21, 22, 23, 24];

    const randomNims = [];
    const count = options.nimCount || Math.floor(Math.random() * 6) + 10;

    for (let i = 0; i < count; i++) {
      const randomYear =
        availableYears[Math.floor(Math.random() * availableYears.length)];
      const randomProdi =
        availableProdi[Math.floor(Math.random() * availableProdi.length)];

      const randomNum = Math.random();
      let randomTipe;
      if (randomNum < 0.9) {
        randomTipe = 1;
      } else if (randomNum < 0.95) {
        randomTipe = 2;
      } else {
        randomTipe = 3;
      }

      const randomUrutan = Math.floor(Math.random() * 100) + 1;
      const urutanFormatted = randomUrutan.toString().padStart(4, "0");
      const nim = `${randomYear}${randomProdi.code}${randomTipe}${urutanFormatted}`;
      randomNims.push(nim);
    }

    setNimInput(randomNims.join(", "));
  };

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
  }, [showToast]);

  return (
    <>
      {!hasResults && (
        <Box
          id="home"
          bg={bgTransparent}
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          pt={{ base: 24 }}
          pb={20}
        >
          <Container maxW="container.xl">
            <VStack spacing={12} textAlign="center">
              <Stack spacing={4} align="center">
                <Heading
                  as="h1"
                  fontSize={{ base: "3xl", md: "5xl" }}
                  fontWeight="bold"
                  color={headingColor}
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
                    color={linkColor}
                    textDecoration="underline"
                    _hover={{
                      color: linkHoverColor,
                    }}
                  >
                    PDDIKTI (Pangkalan Data Pendidikan Tinggi)
                  </Link>
                  . Silakan masukkan NIM (pisahkan dengan spasi atau koma) untuk
                  menampilkan detail profil mahasiswa secara lengkap dan akurat.
                </Text>
              </Stack>

              <Stack spacing={4} w="100%" maxW="600px" bg={bg}>
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
                  size={{ base: "md", sm: "lg" }}
                  fontSize={{ base: "md", sm: "lg" }}
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

                <Menu>
                  <MenuButton
                    as={Button}
                    colorScheme="gray"
                    variant="outline"
                    size="sm"
                    fontSize="sm"
                    rightIcon={<FaChevronDown />}
                  >
                    🎲 Generate NIM Acak
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => generateRandomNIM()}>
                      🎯 Generate NIM Standar (10-15 NIM)
                    </MenuItem>
                    <MenuItem onClick={() => onAdvancedOpen()}>
                      <FaCog style={{ marginRight: "8px" }} />
                      Advanced Options
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Stack>
            </VStack>
          </Container>
        </Box>
      )}

      {hasResults && (
        <Box bg={bgTransparent} minH="100vh" pt={{ base: 24, sm: 32 }} pb={20}>
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
                        color={headingColor}
                        mb={2}
                        fontWeight="bold"
                      >
                        Hasil Pencarian
                      </Heading>
                      <Text color={textColor} fontSize="md">
                        Ditemukan {students.filter((s) => s.found).length} dari{" "}
                        {students.length} mahasiswa
                      </Text>
                    </Box>
                    <TableContainer
                      bg={tableBg}
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
                              _hover={{ bg: tableHoverBg }}
                              userSelect="none"
                            >
                              <Flex align="center" gap={1}>
                                NIM
                                {sortOrder === null && (
                                  <FaSort opacity={0.5} size={10} />
                                )}
                                {sortOrder === "asc" && (
                                  <FaSortUp color={sortIconColor} size={10} />
                                )}
                                {sortOrder === "desc" && (
                                  <FaSortDown color={sortIconColor} size={10} />
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
        <ModalContent bg={modalBg}>
          <ModalHeader
            pb={0}
            display="flex"
            alignItems="center"
            color={modalHeaderColor}
          >
            Detail Mahasiswa
          </ModalHeader>
          <ModalCloseButton top={4} color={modalHeaderColor} />
          <ModalBody pb={6} pt={4}>
            {selectedStudent ? (
              <Student student={selectedStudent} />
            ) : (
              <Text>Memuat...</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isAdvancedOpen} onClose={onAdvancedClose} size="lg">
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader pb={0} color={modalHeaderColor}>
            Advanced NIM Generator Options
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} pt={4}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Jumlah NIM yang akan di-generate</FormLabel>
                <NumberInput
                  value={advancedOptions.nimCount}
                  onChange={(valueString) => {
                    const value = parseInt(valueString) || 10;
                    setAdvancedOptions((prev) => ({
                      ...prev,
                      nimCount: Math.min(Math.max(value, 1), 50),
                    }));
                  }}
                  min={1}
                  max={50}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Filter Tahun Angkatan</FormLabel>
                <Select
                  placeholder="Pilih tahun angkatan (kosong = semua tahun)"
                  value={
                    advancedOptions.selectedYears.length === 1
                      ? advancedOptions.selectedYears[0]
                      : ""
                  }
                  onChange={(e) => {
                    const selectedYear = e.target.value;
                    setAdvancedOptions((prev) => ({
                      ...prev,
                      selectedYears: selectedYear
                        ? [parseInt(selectedYear)]
                        : [],
                    }));
                  }}
                >
                  <option value="19">2019 (19)</option>
                  <option value="20">2020 (20)</option>
                  <option value="21">2021 (21)</option>
                  <option value="22">2022 (22)</option>
                  <option value="23">2023 (23)</option>
                  <option value="24">2024 (24)</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Filter Program Studi</FormLabel>
                <Select
                  placeholder="Pilih program studi (kosong = semua prodi)"
                  value={
                    advancedOptions.selectedProdi.length === 1
                      ? advancedOptions.selectedProdi[0]
                      : ""
                  }
                  onChange={(e) => {
                    const selectedProdi = e.target.value;
                    setAdvancedOptions((prev) => ({
                      ...prev,
                      selectedProdi: selectedProdi ? [selectedProdi] : [],
                    }));
                  }}
                >
                  <optgroup label="Sarjana">
                    {prodiData
                      .filter((p) => !p.code.startsWith("5"))
                      .map((prodi) => (
                        <option key={prodi.code} value={prodi.code}>
                          {prodi.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Magister">
                    {prodiData
                      .filter((p) => p.code.startsWith("5"))
                      .map((prodi) => (
                        <option key={prodi.code} value={prodi.code}>
                          {prodi.name}
                        </option>
                      ))}
                  </optgroup>
                </Select>
              </FormControl>

              <FormControl>
                <Checkbox
                  isChecked={advancedOptions.includeMagister}
                  onChange={(e) => {
                    setAdvancedOptions((prev) => ({
                      ...prev,
                      includeMagister: e.target.checked,
                    }));
                  }}
                  isDisabled={advancedOptions.selectedProdi.length > 0}
                >
                  Sertakan Program Magister (jika tidak ada filter prodi
                  spesifik)
                </Checkbox>
              </FormControl>

              <HStack spacing={3} pt={4}>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    generateRandomNIM(advancedOptions);
                    onAdvancedClose();
                  }}
                  flex={1}
                >
                  Generate NIM
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setAdvancedOptions({
                      selectedProdi: [],
                      selectedYears: [],
                      nimCount: 15,
                      includeMagister: true,
                    });
                  }}
                  flex={1}
                >
                  Reset Options
                </Button>
              </HStack>
            </VStack>
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
