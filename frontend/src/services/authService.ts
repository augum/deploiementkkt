// Swagger ne fournit pas de /api/login. On effectue donc l'authentification
// côté client en récupérant la liste des utilisateurs et en cherchant une
// correspondance login/password. À remplacer par un vrai POST /api/login dès
// que le backend l'exposera.
import { utilisateurService, type Utilisateur } from "./utilisateurService";

export const authService = {
  async login(login: string, password: string): Promise<Utilisateur> {
    const users = await utilisateurService.list();
    const match = users.find(
      (u) => u.login === login && u.password === password,
    );
    if (!match) {
      throw new Error("Identifiants invalides");
    }
    return match;
  },
};