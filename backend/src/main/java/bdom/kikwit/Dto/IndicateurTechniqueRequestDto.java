package bdom.kikwit.Dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor
@JsonRootName(value="indicateur")
public class IndicateurTechniqueRequestDto {
    @Schema(description = "Identifiant unique", example = "25")
    private Long id;
    @Schema(description = "la date de l'enregistrement", example = "2026-05-15")
    private LocalDate periode;
    @Schema(description = "Identifiant de la structure de santé", example = "25")
    private Long id_ess;
    @Schema(description = "Nombre des nouveaux cas curatifs", example = "25")
    private int nv_casCuratif;
    @Schema(description = "Nombre de premier cpn", example = "25")
    private int cpn1;
    @Schema(description = "Nombre de cpn de la première à la seizième semaine", example = "25")
    private int cpn1_16;
    @Schema(description = "Nombre de cpn 4", example = "25")
    private int cpn4;
    @Schema(description = "Nombre APA", example = "25")
    private int apa;
    @Schema(description = "Nombre nouveau accouchement", example = "25")
    private int nv_acc_pf;
    @Schema(description = "Nombre de diabete notification", example = "25")
    private int diabeteNotification;
    @Schema(description = "Nombre de transfusion", example = "25")
    private int transfusion;
    @Schema(description = "Nombre de transfusion testée au 4 marqueurs", example = "25")
    private int transfusionTeste4Marquer;
    @Schema(description = "Nombre de décès neonatal", example = "25")
    private int dc_neonat;
    @Schema(description = "Nombre de décès maternel", example = "25")
    private int dc_maternel;
    @Schema(description = "Nombre de chirurgie majeure", example = "25")
    private int chirurgieMajeure;
    @Schema(description = "Nombre de cesarienne", example = "25")
    private int cesarienne;
    @Schema(description = "Nombre des hospitalisés", example = "25")
    private int hospitalise;
    @Schema(description = "Nombre de décès avant 48H", example = "25")
    private int dc_av48h;
    @Schema(description = "Nombre de décès après 48H", example = "25")
    private int dc_ap48h;
    @Schema(description = "Nombre d'infection après opération'", example = "25")
    private int infePostOp;
    @Schema(description = "Nombre de diarhé simple", example = "25")
    private int diarheSimple;

}
