package bdom.kikwit.Dto;

import bdom.kikwit.Entities.Etablissement;
import com.fasterxml.jackson.annotation.JsonRootName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
@JsonRootName(value="personnel")
public class PersonnelResponseDto {
    private Long id;
    private Long id_ess;
    private int nb_agent_matricule;
    private int nb_agent_nu;
    private int nb_nv_agent_matricule;
    private int nb_nv_agent_salaireEtat;
    private int nb_nv_agent_primeEtat;
    private int nb_agent_primeLocale;
    private Etablissement etablissement;
}
