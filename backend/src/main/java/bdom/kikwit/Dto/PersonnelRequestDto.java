package bdom.kikwit.Dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
@JsonRootName(value="personnel")
public class PersonnelRequestDto {
    @Schema(description = "Identifiant unique", example = "10")
    private Long id;
    @Schema(description = "Identifiant de la structure", example = "10")
    private Long id_ess;
    @Schema(description = "Nombre des agents matriculés", example = "10")
    private int nb_agent_matricule;
    @Schema(description = "Nombre des agents nouvelle unité", example = "10")
    private int nb_agent_nu;
    @Schema(description = "Nombre des nouveaux agents matriculés", example = "10")
    private int nb_nv_agent_matricule;
    @Schema(description = "Nombre des nouveaux agents salariés de l'Etat", example = "10")
    private int nb_nv_agent_salaireEtat;
    @Schema(description = "Nombre des nouveaux agents recevant la prime de l'Etat", example = "10")
    private int nb_nv_agent_primeEtat;
    @Schema(description = "Nombre des nouveaux agents recevant la prime locale", example = "10")
    private int nb_agent_primeLocale;
}
