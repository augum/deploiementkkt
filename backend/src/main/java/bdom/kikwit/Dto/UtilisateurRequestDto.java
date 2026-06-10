package bdom.kikwit.Dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
@JsonRootName(value="utilisateur")
public class UtilisateurRequestDto {
    @Schema(description = "id de l'utilisateur", example = "1")
    private Long id;
    @Schema(description = "nom de l'utilisateur", example = "Itond")
    private String nom;
    @Schema(description = "postnom de l'utilisateur", example = "Monguale")
    private String postnom;
    @Schema(description = "prenom de l'utilisateur", example = "Defgra")
    private String prenom;
    @Schema(description = "Login de l'utilisateur", example = "Makuma")
    private String login;
    @Schema(description = "Mot de passe", example = "Fi1@234")
    private String password;
    @Schema(description = "Identifiant du role", example = "1")
    private Long id_role;
    @Schema(description = "identifiant de l'etablissement", example = "1")
    private Long id_ess;
    @Schema(description = "email de l'utilisateur", example = "exemple@gmail.com")
    private String email;
}
