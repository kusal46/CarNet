package lk.sliit.carnet.auth.jwt;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lk.sliit.carnet.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.List;

@Component @RequiredArgsConstructor
public class JwtAuthFilter extends GenericFilter {
    private final JwtService jwt;
    private final UserRepository users;

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
        throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
        String token = header.substring(7);
        try {
            var claims = jwt.parse(token).getPayload();
            String email = claims.getSubject();
            String role = (String) claims.get("role");
            var user = users.findByEmail(email).orElse(null);
            if (user != null && user.isActive()) {
            var auth = new UsernamePasswordAuthenticationToken(
                email, null, List.of(new SimpleGrantedAuthority("ROLE_"+role)));
            SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (Exception ignored) {}
        }
        chain.doFilter(req, res);
    }
}
