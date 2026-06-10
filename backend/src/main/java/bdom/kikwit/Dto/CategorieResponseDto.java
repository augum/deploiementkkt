package bdom.kikwit.Dto;

import bdom.kikwit.Entities.Etablissement;
import com.fasterxml.jackson.annotation.JsonRootName;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
@JsonRootName(value="categorie")
public class CategorieResponseDto {
    private Long id;
    private String libelle;

}
