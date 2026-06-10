package bdom.kikwit.Dto;

import bdom.kikwit.Enum.TypeEnergie;
import com.fasterxml.jackson.annotation.JsonRootName;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
@JsonRootName(value="sourceernergie")
public class SourceEnergieRequestDto {
    @Schema(description = "Identifiant unique", example = "10")
    private Long id;
    @Schema(description = "Libellé de la source d'energie", example = "Panneau solaire")
    private String libelle;
    @Schema(description = "Type source d'energie", example = "Electric")
    @Enumerated(EnumType.STRING)
    private TypeEnergie typeEnergie;
}
