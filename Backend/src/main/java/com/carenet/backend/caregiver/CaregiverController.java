package com.carenet.backend.caregiver;

import com.carenet.backend.caregiver.dto.CaregiverRequest;
import com.carenet.backend.caregiver.dto.CaregiverUpdateRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.URI;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/caregivers")
public class CaregiverController {

    private final CaregiverRepository repo;
    private final CertificationRepository certRepo;
    @SuppressWarnings("unused")
    private final WorkHistoryRepository workRepo;
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public CaregiverController(
            CaregiverRepository repo,
            CertificationRepository certRepo,
            WorkHistoryRepository workRepo
    ) {
        this.repo = repo;
        this.certRepo = certRepo;
        this.workRepo = workRepo;
    }

    // ----------------- CREATE (already in your app) -----------------
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> create(
            @RequestPart("data") String json,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar,
            @RequestPart(value = "certFiles", required = false) List<MultipartFile> certFiles
    ) throws Exception {

        Files.createDirectories(Path.of(uploadDir));

        CaregiverRequest req = mapper.readValue(json, CaregiverRequest.class);

        Caregiver cg = new Caregiver();
        cg.setName(req.getName());
        cg.setEmail(req.getEmail());
        cg.setLocation(req.getLocation());
        cg.setSummary(req.getSummary());
        cg.setAvailable(req.isAvailable());
        cg.setRate(BigDecimal.valueOf(req.getRate()));

        cg.setLanguages(mapper.writeValueAsString(req.getLanguages()));
        cg.setSkills(mapper.writeValueAsString(req.getSkills()));
        cg.setServices(mapper.writeValueAsString(req.getServices()));

        if (avatar != null && !avatar.isEmpty()) {
            Path dest = storeFile("avatars", avatar);
            cg.setAvatarPath(dest.toString());
        }

        List<Certification> certs = new ArrayList<>();
        if (req.getCertifications() != null) {
            for (int i = 0; i < req.getCertifications().size(); i++) {
                var c = req.getCertifications().get(i);

                Certification cert = new Certification();
                cert.setCaregiver(cg);
                cert.setName(c.getName());
                cert.setIssuer(c.getIssuer());

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

        List<WorkHistory> work = new ArrayList<>();
        if (req.getWorkHistory() != null) {
            for (var w : req.getWorkHistory()) {
                WorkHistory wh = new WorkHistory();
                wh.setCaregiver(cg);
                wh.setDescr(w.getDescription());
                if (w.getStartDate() != null && !w.getStartDate().isBlank()) {
                    wh.setStartDate(LocalDate.parse(w.getStartDate()));
                }
                if (w.getEndDate() != null && !w.getEndDate().isBlank()) {
                    wh.setEndDate(LocalDate.parse(w.getEndDate()));
                }
                work.add(wh);
            }
        }
        cg.setWorkHistory(work);

        Caregiver saved = repo.save(cg);
        return ResponseEntity.created(URI.create("/api/caregivers/" + saved.getId())).body(saved.getId());
    }

    // ----------------- READ -----------------
    @GetMapping
    public List<Caregiver> list() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Caregiver getOne(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Caregiver not found"));
    }

    // ----------------- UPDATE (JSON only, full or partial) -----------------
    // PUT = replace semantics (we require a full payload), PATCH = partial
    @PutMapping("/{id}")
    public Caregiver replace(@PathVariable Long id, @RequestBody CaregiverUpdateRequest req) throws Exception {
        Caregiver cg = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Caregiver not found"));

        // Basic fields (required-ish for PUT)
        cg.setName(nvl(req.getName(), ""));
        cg.setEmail(nvl(req.getEmail(), ""));
        cg.setLocation(nvl(req.getLocation(), ""));
        cg.setSummary(nvl(req.getSummary(), ""));
        cg.setAvailable(req.getAvailable() != null && req.getAvailable());
        cg.setRate(req.getRate() != null ? new BigDecimal(req.getRate()) : BigDecimal.ZERO);

        cg.setLanguages(toJsonArray(req.getLanguages()));
        cg.setSkills(toJsonArray(req.getSkills()));
        cg.setServices(toJsonArray(req.getServices()));

        // Replace certifications
        if (req.getCertifications() != null) {
            // remove existing
            if (cg.getCertifications() != null) {
                // delete files on disk (optional)
                for (Certification old : new ArrayList<>(cg.getCertifications())) {
                    deleteIfExists(old.getFilePath());
                }
                cg.getCertifications().clear();
            }
            // add new
            List<Certification> fresh = new ArrayList<>();
            for (var c : req.getCertifications()) {
                Certification cert = new Certification();
                cert.setCaregiver(cg);
                cert.setName(nvl(c.getName(), ""));
                cert.setIssuer(nvl(c.getIssuer(), ""));
                // When updating via JSON only, we don't get new files.
                // Keep file fields empty unless your UI supplies them.
                fresh.add(cert);
            }
            cg.setCertifications(fresh);
        }

        // Replace work history
        if (req.getWorkHistory() != null) {
            if (cg.getWorkHistory() != null) cg.getWorkHistory().clear();
            List<WorkHistory> freshW = new ArrayList<>();
            for (var w : req.getWorkHistory()) {
                WorkHistory wh = new WorkHistory();
                wh.setCaregiver(cg);
                wh.setDescr(nvl(w.getDescription(), ""));
                if (w.getStartDate() != null && !w.getStartDate().isBlank()) {
                    wh.setStartDate(LocalDate.parse(w.getStartDate()));
                }
                if (w.getEndDate() != null && !w.getEndDate().isBlank()) {
                    wh.setEndDate(LocalDate.parse(w.getEndDate()));
                }
                freshW.add(wh);
            }
            cg.setWorkHistory(freshW);
        }

        return repo.save(cg);
    }

    @PatchMapping("/{id}")
    public Caregiver updatePartial(@PathVariable Long id, @RequestBody CaregiverUpdateRequest req) throws Exception {
        Caregiver cg = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Caregiver not found"));

        if (req.getName() != null) cg.setName(req.getName());
        if (req.getEmail() != null) cg.setEmail(req.getEmail());
        if (req.getLocation() != null) cg.setLocation(req.getLocation());
        if (req.getSummary() != null) cg.setSummary(req.getSummary());
        if (req.getAvailable() != null) cg.setAvailable(req.getAvailable());
        if (req.getRate() != null) cg.setRate(new BigDecimal(req.getRate()));
        if (req.getLanguages() != null) cg.setLanguages(toJsonArray(req.getLanguages()));
        if (req.getSkills() != null) cg.setSkills(toJsonArray(req.getSkills()));
        if (req.getServices() != null) cg.setServices(toJsonArray(req.getServices()));

        // Optional: allow replacing children on PATCH if provided
        if (req.getCertifications() != null) {
            // clear current (and delete files)
            if (cg.getCertifications() != null) {
                for (Certification old : new ArrayList<>(cg.getCertifications())) {
                    deleteIfExists(old.getFilePath());
                }
                cg.getCertifications().clear();
            }
            List<Certification> fresh = new ArrayList<>();
            for (var c : req.getCertifications()) {
                Certification cert = new Certification();
                cert.setCaregiver(cg);
                cert.setName(nvl(c.getName(), ""));
                cert.setIssuer(nvl(c.getIssuer(), ""));
                fresh.add(cert);
            }
            cg.setCertifications(fresh);
        }

        if (req.getWorkHistory() != null) {
            if (cg.getWorkHistory() != null) cg.getWorkHistory().clear();
            List<WorkHistory> freshW = new ArrayList<>();
            for (var w : req.getWorkHistory()) {
                WorkHistory wh = new WorkHistory();
                wh.setCaregiver(cg);
                wh.setDescr(nvl(w.getDescription(), ""));
                if (w.getStartDate() != null && !w.getStartDate().isBlank()) {
                    wh.setStartDate(LocalDate.parse(w.getStartDate()));
                }
                if (w.getEndDate() != null && !w.getEndDate().isBlank()) {
                    wh.setEndDate(LocalDate.parse(w.getEndDate()));
                }
                freshW.add(wh);
            }
            cg.setWorkHistory(freshW);
        }

        return repo.save(cg);
    }

    // ----------------- File-only updates (avatar/cert file) -----------------
    @PutMapping(path = "/{id}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Caregiver replaceAvatar(@PathVariable Long id, @RequestPart("avatar") MultipartFile avatar) throws IOException {
        Caregiver cg = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Caregiver not found"));

        // delete old file
        deleteIfExists(cg.getAvatarPath());

        Path dest = storeFile("avatars", avatar);
        cg.setAvatarPath(dest.toString());

        return repo.save(cg);
    }

    @PutMapping(path = "/{id}/certifications/{cid}/file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Certification replaceCertFile(   @PathVariable Long id,
                                            @PathVariable Long cid,
                                            @RequestPart("file") MultipartFile file) throws IOException {
        Caregiver cg = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Caregiver not found"));

        Certification cert = certRepo.findById(cid)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Certification not found"));

        if (!cert.getCaregiver().getId().equals(cg.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cert does not belong to caregiver");
        }

        deleteIfExists(cert.getFilePath());

        Path dest = storeFile("certs", file);
        cert.setFilePath(dest.toString());
        cert.setFileName(file.getOriginalFilename());
        cert.setMimeType(file.getContentType());

        return certRepo.save(cert);
    }

    // ----------------- DELETE -----------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Caregiver cg = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Caregiver not found"));

        // delete avatar
        deleteIfExists(cg.getAvatarPath());
        // delete cert files
        if (cg.getCertifications() != null) {
            for (Certification c : cg.getCertifications()) {
                deleteIfExists(c.getFilePath());
            }
        }

        repo.delete(cg);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/certifications/{cid}")
    public ResponseEntity<Void> deleteCertification(@PathVariable Long id, @PathVariable Long cid) {
        Caregiver cg = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Caregiver not found"));

        Certification cert = certRepo.findById(cid)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Certification not found"));

        if (!cert.getCaregiver().getId().equals(cg.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cert does not belong to caregiver");
        }

        deleteIfExists(cert.getFilePath());
        certRepo.delete(cert);
        return ResponseEntity.noContent().build();
    }

    // ----------------- helpers -----------------
    private Path storeFile(String subdir, MultipartFile file) throws IOException {
        Path dir = Path.of(uploadDir, subdir);
        Files.createDirectories(dir);
        String safeName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path dest = dir.resolve(safeName);
        Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);
        return dest;
    }

    private void deleteIfExists(String p) {
        if (p == null || p.isBlank()) return;
        try { Files.deleteIfExists(Path.of(p)); } catch (Exception ignored) {}
    }

    private static String nvl(String v, String def) { return v == null ? def : v; }

    private String toJsonArray(List<String> arr) throws IOException {
        if (arr == null) return "[]";
        return mapper.writeValueAsString(arr);
    }
}
