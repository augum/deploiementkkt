package bdom.kikwit.Dto;

import bdom.kikwit.Entities.Etablissement;
import bdom.kikwit.Entities.Role;
import com.fasterxml.jackson.annotation.JsonRootName;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
@JsonRootName(value="utilisateur")
public class UtilisateurResponseDto {

    private Long id;
    private String nom;
    private String postnom;
    private String prenom;
    private String login;
    private String password;
    private Long id_role;
    private Long id_ess;
    private Role role;
    private Etablissement etablissement;
    private String email;
}
