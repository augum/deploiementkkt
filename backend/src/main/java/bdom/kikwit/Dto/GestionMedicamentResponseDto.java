package bdom.kikwit.Dto;

import bdom.kikwit.Entities.Etablissement;
import com.fasterxml.jackson.annotation.JsonRootName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor
@JsonRootName(value="Gestionmedicament")
public class GestionMedicamentResponseDto {
    private Long id;
    private Long id_ess;
    private LocalDate periode;
    private double capital_depart;
    private double capital_fin_moi;
    private String croissance;
    private String benefice;
    private Etablissement etablissement;
}
