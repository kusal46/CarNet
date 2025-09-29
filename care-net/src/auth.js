export const auth = {
    save({ accessToken, role, userId }) {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("role", role);
        localStorage.setItem("userId", String(userId));
    },
    clear() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
    },
    token() { return localStorage.getItem("token"); },
    role()  { return localStorage.getItem("role");  },
    is(role) { return auth.role() === role; }
};
