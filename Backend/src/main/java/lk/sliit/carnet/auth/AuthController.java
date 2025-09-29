package lk.sliit.carnet.auth;

import jakarta.validation.Valid;
import lk.sliit.carnet.auth.dto.RegisterRequest;
import lk.sliit.carnet.auth.dto.LoginRequest;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Service

@RestController @RequestMapping("/auth") @RequiredArgsConstructor
public class AuthController {
    private final AuthService auth;

    @PostMapping("/register")
    public ResponseEntity<Object> register(@Valid @RequestBody RegisterRequest req){
        return ResponseEntity.ok(auth.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@Valid @RequestBody LoginRequest req){
        return ResponseEntity.ok(auth.login(req));
    }
}
