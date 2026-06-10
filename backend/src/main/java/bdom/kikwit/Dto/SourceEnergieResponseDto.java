package bdom.kikwit.Dto;

import bdom.kikwit.Enum.TypeEnergie;
import com.fasterxml.jackson.annotation.JsonRootName;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
@JsonRootName(value="sourceernergie")
public class SourceEnergieResponseDto {
    private Long id;
    private String libelle;
    @Enumerated(EnumType.STRING)
    private TypeEnergie typeEnergie;
}
