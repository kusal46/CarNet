package com.carenet.backend.caregiver;

import com.carenet.backend.caregiver.dto.CaregiverRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/caregivers")
@CrossOrigin // remove if you already handle CORS globally
public class CaregiverController {

    private final CaregiverRepository repo;
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public CaregiverController(CaregiverRepository repo) {
        this.repo = repo;
    }

    /**
     * CREATE caregiver + optional files (avatar + certificate files)
     * Expects multipart/form-data with:
     *  - data: stringified JSON of CaregiverRequest
     *  - avatar: (optional) single file
     *  - certFiles: (optional) array of files, aligned by index with request.certifications
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> create(
            @RequestPart("data") String json,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar,
            @RequestPart(value = "certFiles", required = false) List<MultipartFile> certFiles
    ) throws Exception {

        // ensure base folder exists
        Files.createDirectories(Path.of(uploadDir));

        // parse JSON part to DTO
        CaregiverRequest req = mapper.readValue(json, CaregiverRequest.class);

        // --- map DTO -> Entity (basic fields) ---
        Caregiver cg = new Caregiver();
        cg.setName(req.getName());
        cg.setEmail(req.getEmail());
        cg.setLocation(req.getLocation());
        cg.setSummary(req.getSummary());
        cg.setAvailable(req.isAvailable());

        // rate uses DECIMAL in DB -> BigDecimal in entity
        cg.setRate(BigDecimal.valueOf(req.getRate()));

        // store arrays as JSON strings (your entity fields are String with JSON)
        cg.setLanguages(mapper.writeValueAsString(req.getLanguages() != null ? req.getLanguages() : List.of()));
        cg.setSkills(mapper.writeValueAsString(req.getSkills() != null ? req.getSkills() : List.of()));
        cg.setServices(mapper.writeValueAsString(req.getServices() != null ? req.getServices() : List.of()));

        // --- avatar file (optional) ---
        if (avatar != null && !avatar.isEmpty()) {
            Path dest = storeFile("avatars", avatar);
            cg.setAvatarPath(dest.toString());
        }

        // --- certifications + optional files ---
        List<Certification> certs = new ArrayList<>();
        if (req.getCertifications() != null) {
            for (int i = 0; i < req.getCertifications().size(); i++) {
                var c = req.getCertifications().get(i);

                Certification cert = new Certification();
                cert.setCaregiver(cg);
                cert.setName(c.getName());
                cert.setIssuer(c.getIssuer());

                // if a file with the same index exists, store it
                if (certFiles != null && i < certFiles.size()) {
                    MultipartFile f = certFiles.get(i);
                    if (f != null && !f.isEmpty()) {
                        Path dest = storeFile("certs", f);
                        cert.setFilePath(dest.toString());
                        cert.setFileName(f.getOriginalFilename());
                        cert.setMimeType(f.getContentType());
                    }
                }
                certs.add(cert);
            }
        }
        cg.setCertifications(certs);

        // --- work history (Option B → descr, startDate, endDate) ---
        List<WorkHistory> work = new ArrayList<>();
        if (req.getWorkHistory() != null) {
            for (var w : req.getWorkHistory()) {
                WorkHistory wh = new WorkHistory();
                wh.setCaregiver(cg);
                wh.setDescr(w.getDescription());

                if (w.getStartDate() != null && !w.getStartDate().isBlank()) {
                    wh.setStartDate(LocalDate.parse(w.getStartDate())); // expects yyyy-MM-dd
                }
                if (w.getEndDate() != null && !w.getEndDate().isBlank()) {
                    wh.setEndDate(LocalDate.parse(w.getEndDate()));
                }
                work.add(wh);
            }
        }
        cg.setWorkHistory(work);

        // --- persist ---
        Caregiver saved = repo.save(cg);

        // 201 Created with Location
        return ResponseEntity
                .created(URI.create("/api/caregivers/" + saved.getId()))
                .body(saved.getId());
    }

    // LIST (handy for debugging or a finder page)
    @GetMapping
    public List<Caregiver> list() {
        return repo.findAll();
    }

    // GET one caregiver (used by your CaregiverProfile page)
    @GetMapping("/{id}")
        public ResponseEntity<?> getOne(@PathVariable Long id) {
            Caregiver cg = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Caregiver not found"));

            var certs = cg.getCertifications().stream()
                .map(c -> new CertDto(c.getId(), c.getName(), c.getIssuer(), c.getFilePath(), c.getFileName(), c.getMimeType()))
                .toList();

            var work = cg.getWorkHistory().stream()
                .map(w -> new WorkDto(w.getId(), w.getDescr(), w.getStartDate(), w.getEndDate()))
                .toList();

            var dto = new CaregiverDto(
                cg.getId(), cg.getName(), cg.getEmail(), cg.getLocation(), cg.getSummary(),
                cg.isAvailable(), cg.getRate(), cg.getLanguages(), cg.getSkills(), cg.getServices(),
                cg.getAvatarPath(), certs, work
            );

            return ResponseEntity.ok(dto);
        }

        record CaregiverDto(
            Long id, String name, String email, String location, String summary,
            boolean available, java.math.BigDecimal rate,
            String languages, String skills, String services,
            String avatarPath, java.util.List<CertDto> certifications,
            java.util.List<WorkDto> workHistory
        ) {}

        record CertDto(Long id, String name, String issuer, String filePath, String fileName, String mimeType) {}
        record WorkDto(Long id, String descr, java.time.LocalDate startDate, java.time.LocalDate endDate) {}


    // ---------- helpers ----------

    private Path storeFile(String subdir, MultipartFile file) throws IOException {
        Path dir = Path.of(uploadDir, subdir);
        Files.createDirectories(dir);
        String original = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        @SuppressWarnings("null")
        String safeName = System.currentTimeMillis() + "_" + original.replaceAll("[\\s/\\\\]+", "_");
        Path dest = dir.resolve(safeName);
        Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);
        return dest;
    }
}
