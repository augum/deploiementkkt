package bdom.kikwit.Dto;

import bdom.kikwit.Entities.Categorie;
import com.fasterxml.jackson.annotation.JsonRootName;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
@JsonRootName(value="etablissement")
public class EtablissementResponseDto {
    private Long id;
    private String nom;
    private String zone;
    private Long id_cat;
    private Categorie categorie;
}
