package bdom.kikwit.Dto;

import bdom.kikwit.Entities.Etablissement;
import com.fasterxml.jackson.annotation.JsonRootName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor
@JsonRootName(value="indicateur")
public class IndicateurTechniqueResponseDto {
    private Long id;
    private LocalDate periode;
    private Long id_ess;
    private int nv_casCuratif;
    private int cpn1;
    private int cpn1_16;
    private int cpn4;
    private int apa;
    private int nv_acc_pf;
    private int diabeteNotification;
    private int transfusion;
    private int transfusionTeste4Marquer;
    private int dc_neonat;
    private int dc_maternel;
    private int chirurgieMajeure;
    private int cesarienne;
    private int hospitalise;
    private int dc_av48h;
    private int dc_ap48h;
    private int infePostOp;
    private int diarheSimple;
    private Etablissement etablissement;

}
