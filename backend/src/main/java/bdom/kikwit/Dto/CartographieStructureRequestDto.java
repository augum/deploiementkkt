package bdom.kikwit.Dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
@JsonRootName(value="cartographie")
public class CartographieStructureRequestDto {
    @Schema(description = "Identifiant unique", example = "1")
    private Long id;
    @Schema(description = "Identifiant de la structure de santé", example = "1")
    private Long id_ess;
    @Schema(description = "Distance de la structure avec le bdom", example = "10km")
    private String distance_bdom;
    @Schema(description = "La population ciblée par la structure", example = "Rural")
    private String population_cible;
    @Schema(description = "Identifiant source d'energie", example = "1")
    private Long id_se;
    @Schema(description = "La structure a un bloc operatoire", example = "true")
    private boolean presence_blocop;
    @Schema(description = "La structure peut faire des transfusion", example = "true")
    private boolean capacite_transfusion;
    @Schema(description = "Comment la structure est elle électrifiée", example = "Snel")
    private String electricite;
    @Schema(description = "Source d'eau", example = "Forage")
    private String eau;
    @Schema(description = "La structure a subi des reabilitation", example = "oui")
    private String reabilitation;
    @Schema(description = "Dispose d'un forage", example = "oui")
    private String forage;
    @Schema(description = "Possede un incinerateur", example = "oui")
    private String incinerateur;
    @Schema(description = "Possede des equipements biomédicaux", example = "Non")
    private String equipement_biom;
}
