package bdom.kikwit.Dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor
@JsonRootName(value="Gestionmedicament")
public class GestionMedicamentRequestDto {
    @Schema(description = "Identifiant unique", example = "10")
    private Long id;
    @Schema(description = "Identifiant de la structure", example = "25")
    private Long id_ess;
    @Schema(description = "La date de l'enregistrement ", example = "2026-05-15")
    private LocalDate periode;
    @Schema(description = "Le capital de départ", example = "1000.00")
    private double capital_depart;
    @Schema(description = "Le capital à la fin du mois", example = "15000.00")
    private double capital_fin_moi;
    @Schema(description = "Croissance", example = "50%")
    private String croissance;
    @Schema(description = "Bénéfice", example = "5000$")
    private String benefice;
}
