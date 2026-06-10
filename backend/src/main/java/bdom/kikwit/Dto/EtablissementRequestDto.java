package bdom.kikwit.Dto;

import bdom.kikwit.Entities.Categorie;
import com.fasterxml.jackson.annotation.JsonRootName;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
@JsonRootName(value="etablissement")
public class EtablissementRequestDto {
    @Schema(description = "Identifiant unique", example = "1")
    private Long id;
    @Schema(description = "Nom de l'etablissement", example = "Hopital Mpanga")
    private String nom;
    @Schema(description = "La zone de santé", example = "Kikwit")
    private String zone;
    @Schema(description = "Identifiant de la catégorie", example = "1")
    private Long id_cat;
}
